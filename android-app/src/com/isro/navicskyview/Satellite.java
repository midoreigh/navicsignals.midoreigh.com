package com.isro.navicskyview;

public class Satellite {
    public final int svid;
    public final int prn;
    public final int constellationType;
    public final String constellationName;
    public final float cn0DbHz;
    public final float elevation;
    public final float azimuth;
    public final boolean usedInFix;
    public final Float carrierFrequencyHz;
    public final boolean isNavic;

    public Satellite(int svid, int constellationType, String constellationName,
                     float cn0DbHz, float elevation, float azimuth,
                     boolean usedInFix, Float carrierFrequencyHz) {
        this.svid = svid;
        this.prn = svid;
        this.constellationType = constellationType;
        this.constellationName = constellationName;
        this.cn0DbHz = cn0DbHz;
        this.elevation = elevation;
        this.azimuth = azimuth;
        this.usedInFix = usedInFix;
        this.carrierFrequencyHz = carrierFrequencyHz;
        this.isNavic = (constellationType == 7); // CONSTELLATION_IRNSS is 7
    }

    public String getFlag() {
        if (constellationType == 7) { // CONSTELLATION_IRNSS
            return "🇮🇳";
        } else if (constellationType == 1) { // CONSTELLATION_GPS
            return "🇺🇸";
        } else if (constellationType == 6) { // CONSTELLATION_GALILEO
            return "🇪🇺";
        } else if (constellationType == 5) { // CONSTELLATION_BEIDOU
            return "🇨🇳";
        } else if (constellationType == 3) { // CONSTELLATION_GLONASS
            return "🇷🇺";
        } else if (constellationType == 4) { // CONSTELLATION_QZSS
            return "🇯🇵";
        } else if (constellationType == 2) { // CONSTELLATION_SBAS (GAGAN / WAAS)
            return "🇮🇳";
        }
        return "";
    }

    public String getCountry() {
        if (constellationType == 7) {
            return "India";
        } else if (constellationType == 1) {
            return "USA";
        } else if (constellationType == 6) {
            return "EU";
        } else if (constellationType == 5) {
            return "China";
        } else if (constellationType == 3) {
            return "Russia";
        } else if (constellationType == 4) {
            return "Japan";
        } else if (constellationType == 2) {
            return "India (GAGAN)";
        }
        return "Global";
    }

    public String getCarrierLabel() {
        if (carrierFrequencyHz == null) {
            return isNavic ? "L5" : "L1";
        }
        float hz = carrierFrequencyHz;
        if (hz >= 1164e6f && hz <= 1189e6f) {
            return "L5 (1176 MHz)";
        } else if (hz >= 2483.5e6f && hz <= 2500e6f) {
            return "S-band (2492 MHz)";
        } else if (hz >= 1559e6f && hz <= 1591e6f) {
            return "L1 (1575 MHz)";
        }
        return "Dual-Band";
    }
}
