package com.midoreigh.navicsignals;

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

    public String getSatelliteName() {
        if (constellationType == 7) { // CONSTELLATION_IRNSS / NavIC
            switch (svid) {
                case 1: return "IRNSS-1A";
                case 2: return "IRNSS-1B";
                case 3: return "IRNSS-1C";
                case 4: return "IRNSS-1D";
                case 5: return "IRNSS-1E";
                case 6: return "IRNSS-1F";
                case 7: return "IRNSS-1G";
                case 8: return "IRNSS-1H";
                case 9: return "IRNSS-1I";
                case 10: return "NVS-01";
                case 11: return "NVS-02";
                case 12: return "NVS-03";
                default: return "IRNSS-" + svid;
            }
        } else if (constellationType == 1) { // GPS
            return "GPS-" + svid;
        } else if (constellationType == 6) { // Galileo
            return "GSAT-" + svid;
        } else if (constellationType == 5) { // BeiDou
            return "BDS-" + svid;
        } else if (constellationType == 3) { // GLONASS
            return "GLO-" + svid;
        } else if (constellationType == 4) { // QZSS
            return "QZS-" + svid;
        } else if (constellationType == 2) { // SBAS (GAGAN)
            if (svid == 127) return "GSAT-8 (GAGAN)";
            if (svid == 128) return "GSAT-10 (GAGAN)";
            if (svid == 132) return "GSAT-15 (GAGAN)";
            return "SBAS-" + svid;
        }
        return constellationName + "-" + svid;
    }

    public String getShortName() {
        if (constellationType == 7) {
            switch (svid) {
                case 1: return "1A";
                case 2: return "1B";
                case 3: return "1C";
                case 4: return "1D";
                case 5: return "1E";
                case 6: return "1F";
                case 7: return "1G";
                case 8: return "1H";
                case 9: return "1I";
                case 10: return "NVS1";
                case 11: return "NVS2";
                case 12: return "NVS3";
                default: return "I" + svid;
            }
        }
        return String.valueOf(svid);
    }
}
