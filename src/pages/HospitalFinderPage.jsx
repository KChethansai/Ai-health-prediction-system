import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, Loader2, AlertTriangle, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import axios from "@/lib/axios";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { isEmergencyCondition, computeHospitalScore } from "@/components/hospital-finder/types";
import EmergencyContacts from "@/components/hospital-finder/EmergencyContacts";
import EmergencyAlert from "@/components/hospital-finder/EmergencyAlert";
import HospitalSearch from "@/components/hospital-finder/HospitalSearch";
import HospitalCard from "@/components/hospital-finder/HospitalCard";
import HospitalDetailModal from "@/components/hospital-finder/HospitalDetailModal";
import HospitalSkeleton from "@/components/hospital-finder/HospitalSkeleton";
import * as React from "react";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png"
});
const hospitalIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});
const emergencyIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});
const userIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});
function HospitalFinderPage() {
  const [searchParams] = useSearchParams();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("smart");
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [detailHospital, setDetailHospital] = useState(null);
  const [radius, setRadius] = useState("5000");
  const [only24h, setOnly24h] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [emergencyMode, setEmergencyMode] = useState(false);
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const clusterRef = useRef(null);
  useEffect(() => {
    const symptomsParam = searchParams.get("symptoms");
    const diseasesParam = searchParams.get("diseases");
    const emergencyParam = searchParams.get("emergency");
    if (emergencyParam === "true") {
      setEmergencyMode(true);
      setFilter("emergency");
      setOnly24h(true);
      setRadius("10000");
      return;
    }
    if (symptomsParam || diseasesParam) {
      const symptoms = symptomsParam ? symptomsParam.split(",") : [];
      const diseases = diseasesParam ? diseasesParam.split(",") : [];
      if (isEmergencyCondition(symptoms, diseases)) {
        setEmergencyMode(true);
        setFilter("emergency");
        setOnly24h(true);
        setRadius("10000");
      }
    }
  }, [searchParams]);
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    const map = L.map(mapContainerRef.current).setView([20.5937, 78.9629], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
    }).addTo(map);
    clusterRef.current = L.markerClusterGroup();
    map.addLayer(clusterRef.current);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);
  const filtered = useMemo(() => {
    let list = hospitals.filter((h) => {
      if (filter === "emergency") return h.emergency;
      if (filter === "hospital") return h.type === "Hospital";
      if (filter === "clinic") return h.type === "Clinic";
      return true;
    }).filter((h) => {
      if (!only24h) return true;
      const oh = (h.openingHours || "").toLowerCase();
      return oh.includes("24") || oh === "24/7";
    });
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (h) => h.name.toLowerCase().includes(q) || h.address.toLowerCase().includes(q) || (h.operator || "").toLowerCase().includes(q) || h.type.toLowerCase().includes(q)
      );
    }
    if (sortBy === "smart") {
      list.sort((a, b) => computeHospitalScore(a) - computeHospitalScore(b));
    } else if (sortBy === "distance") {
      list.sort((a, b) => a.distance - b.distance);
    } else {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [hospitals, filter, only24h, searchQuery, sortBy]);
  const nearestEmergency = useMemo(() => {
    const emergencyHospitals = hospitals.filter((h) => h.emergency).sort((a, b) => a.distance - b.distance);
    return emergencyHospitals[0] || null;
  }, [hospitals]);
  useEffect(() => {
    if (!mapRef.current || !clusterRef.current) return;
    clusterRef.current.clearLayers();
    if (location) {
      const existing = mapRef.current;
      existing.eachLayer((layer) => {
        if (layer._isUserMarker) existing.removeLayer(layer);
      });
      const um = L.marker([location.lat, location.lng], { icon: userIcon }).bindPopup("<strong>Your Location</strong>");
      um._isUserMarker = true;
      um.addTo(existing);
    }
    filtered.forEach((h) => {
      const icon = h.emergency ? emergencyIcon : hospitalIcon;
      const marker = L.marker([h.lat, h.lng], { icon }).bindPopup(`
        <div style="min-width:200px;font-family:system-ui">
          <strong>${h.name}</strong>
          <p style="font-size:12px;color:#666;margin:4px 0">${h.address}</p>
          <div style="font-size:12px;margin:4px 0">\u{1F4CD} ${h.distance} km ${h.emergency ? '<span style="color:red;font-weight:600">\u{1F6A8} ER</span>' : ""}</div>
          ${h.phone ? `<p style="font-size:12px">\u{1F4DE} ${h.phone}</p>` : ""}
        </div>
      `);
      marker.on("click", () => setSelectedHospital(h));
      clusterRef.current.addLayer(marker);
    });
  }, [filtered, location]);
  useEffect(() => {
    if (location && mapRef.current) {
      mapRef.current.setView([location.lat, location.lng], 13);
    }
  }, [location]);
  const detectLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(loc);
        fetchHospitals(loc);
      },
      () => {
        const loc = { lat: 17.385, lng: 78.4867 };
        setLocation(loc);
        fetchHospitals(loc);
        toast.info("Using default location (Hyderabad). Allow location access for better results.");
      }
    );
  };
  const fetchHospitals = async (loc) => {
    setLoading(true);
    try {
      const { data } = await axios.post("/hospitals/search", { lat: loc.lat, lng: loc.lng, radius: parseInt(radius) });
      if (data?.error) throw new Error(data.error);
      setHospitals(data.hospitals || []);
      if (data.hospitals?.length === 0) {
        toast.info("No hospitals found nearby. Try increasing the search radius.");
      } else {
        toast.success(`Found ${data.hospitals.length} hospital(s) nearby`);
      }
    } catch (e) {
      toast.error("Failed to fetch hospitals: " + (e.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    detectLocation();
  }, []);
  useEffect(() => {
    if (location) fetchHospitals(location);
  }, [radius]);
  const openDirections = (h) => {
    const url = location ? `https://www.google.com/maps/dir/?api=1&origin=${location.lat},${location.lng}&destination=${h.lat},${h.lng}` : `https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}`;
    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (!win) {
      toast.error("Unable to open directions. Please allow pop-ups and try again.");
    }
  };
  const openGoogleMaps = (h) => {
    const win = window.open(`https://www.google.com/maps/search/?api=1&query=${h.lat},${h.lng}`, "_blank", "noopener,noreferrer");
    if (!win) {
      window.open(`https://www.openstreetmap.org/?mlat=${h.lat}&mlon=${h.lng}#map=18/${h.lat}/${h.lng}`, "_blank", "noopener,noreferrer");
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen bg-background" }, /* @__PURE__ */ React.createElement(Navbar, null), /* @__PURE__ */ React.createElement("div", { className: "pt-24 section-padding" }, /* @__PURE__ */ React.createElement("div", { className: "container mx-auto" }, /* @__PURE__ */ React.createElement(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "page-header" }, /* @__PURE__ */ React.createElement("h1", null, "Find Nearby ", /* @__PURE__ */ React.createElement("span", { className: "gradient-text" }, "Hospitals")), /* @__PURE__ */ React.createElement("p", null, "Real hospitals near you with emergency services, smart ranking, and directions")), emergencyMode && /* @__PURE__ */ React.createElement(
    EmergencyAlert,
    {
      nearestEmergency,
      onNavigate: openDirections,
      onCallAmbulance: () => {
      }
    }
  ), /* @__PURE__ */ React.createElement(EmergencyContacts, null), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-3 items-center justify-center mb-6" }, /* @__PURE__ */ React.createElement(HospitalSearch, { value: searchQuery, onChange: setSearchQuery }), /* @__PURE__ */ React.createElement("div", { className: "flex gap-1 bg-card rounded-lg p-1 border border-border" }, [
    { value: "all", label: "All" },
    { value: "hospital", label: "Hospitals" },
    { value: "clinic", label: "Clinics" },
    { value: "emergency", label: "Emergency" }
  ].map((f) => /* @__PURE__ */ React.createElement(Button, { key: f.value, variant: filter === f.value ? "default" : "ghost", size: "sm", onClick: () => setFilter(f.value) }, f.value === "emergency" && /* @__PURE__ */ React.createElement(AlertTriangle, { className: "w-3.5 h-3.5 mr-1" }), f.label))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 bg-card rounded-lg px-3 py-1.5 border border-border" }, /* @__PURE__ */ React.createElement(Switch, { id: "24h", checked: only24h, onCheckedChange: setOnly24h }), /* @__PURE__ */ React.createElement(Label, { htmlFor: "24h", className: "text-xs cursor-pointer" }, "Open 24h")), /* @__PURE__ */ React.createElement(Select, { value: radius, onValueChange: setRadius }, /* @__PURE__ */ React.createElement(SelectTrigger, { className: "w-36" }, /* @__PURE__ */ React.createElement(SelectValue, null)), /* @__PURE__ */ React.createElement(SelectContent, null, /* @__PURE__ */ React.createElement(SelectItem, { value: "2000" }, "2 km radius"), /* @__PURE__ */ React.createElement(SelectItem, { value: "5000" }, "5 km radius"), /* @__PURE__ */ React.createElement(SelectItem, { value: "10000" }, "10 km radius"), /* @__PURE__ */ React.createElement(SelectItem, { value: "20000" }, "20 km radius"))), /* @__PURE__ */ React.createElement(Select, { value: sortBy, onValueChange: (v) => setSortBy(v) }, /* @__PURE__ */ React.createElement(SelectTrigger, { className: "w-36" }, /* @__PURE__ */ React.createElement(SelectValue, null)), /* @__PURE__ */ React.createElement(SelectContent, null, /* @__PURE__ */ React.createElement(SelectItem, { value: "smart" }, "Smart Ranking"), /* @__PURE__ */ React.createElement(SelectItem, { value: "distance" }, "By Distance"), /* @__PURE__ */ React.createElement(SelectItem, { value: "name" }, "By Name"))), /* @__PURE__ */ React.createElement(Button, { variant: "outline", size: "sm", onClick: detectLocation, disabled: loading, className: "gap-2" }, loading ? /* @__PURE__ */ React.createElement(Loader2, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ React.createElement(Navigation, { className: "w-4 h-4" }), "Refresh")), emergencyMode && nearestEmergency && !loading && /* @__PURE__ */ React.createElement(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "mb-4 flex justify-center" }, /* @__PURE__ */ React.createElement(
    Button,
    {
      size: "lg",
      variant: "destructive",
      className: "gap-2 text-base px-8 shadow-lg",
      onClick: () => openDirections(nearestEmergency)
    },
    /* @__PURE__ */ React.createElement(Navigation, { className: "w-5 h-5" }),
    "Navigate to Nearest Emergency Hospital"
  )), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6" }, /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-2 bg-card rounded-xl overflow-hidden border border-border relative z-0", style: { height: "550px" } }, /* @__PURE__ */ React.createElement("div", { ref: mapContainerRef, className: "h-full w-full" })), /* @__PURE__ */ React.createElement("div", { className: "space-y-3 max-h-[550px] overflow-y-auto pr-1" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm text-muted-foreground mb-2 flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Building2, { className: "w-4 h-4" }), loading ? "Searching..." : `${filtered.length} result(s) found`, emergencyMode && /* @__PURE__ */ React.createElement("span", { className: "text-destructive font-medium text-xs ml-auto" }, "\u{1F6A8} Emergency Mode")), loading ? Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ React.createElement(HospitalSkeleton, { key: i })) : filtered.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "text-center py-12 text-muted-foreground" }, /* @__PURE__ */ React.createElement(MapPin, { className: "w-12 h-12 mx-auto mb-4 opacity-30" }), /* @__PURE__ */ React.createElement("p", null, "No hospitals found. Try a larger radius or different search.")) : filtered.map((h, i) => /* @__PURE__ */ React.createElement(
    HospitalCard,
    {
      key: h.id,
      hospital: h,
      index: i,
      isSelected: selectedHospital?.id === h.id,
      isEmergencyMode: emergencyMode,
      onSelect: setSelectedHospital,
      onDirections: openDirections,
      onGoogleMaps: openGoogleMaps,
      onViewDetails: setDetailHospital
    }
  )))))), /* @__PURE__ */ React.createElement(
    HospitalDetailModal,
    {
      hospital: detailHospital,
      open: !!detailHospital,
      onClose: () => setDetailHospital(null),
      onDirections: openDirections
    }
  ), /* @__PURE__ */ React.createElement(Footer, null));
}
export {
  HospitalFinderPage as default
};
