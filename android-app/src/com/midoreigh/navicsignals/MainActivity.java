package com.midoreigh.navicsignals;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.graphics.Typeface;
import android.location.GnssStatus;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.location.OnNmeaMessageListener;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.ScrollView;
import android.widget.SeekBar;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedList;
import java.util.List;

public class MainActivity extends Activity implements LocationListener, OnNmeaMessageListener, Handler.Callback, View.OnClickListener, Runnable {

    private static final int REQ_PERMISSIONS = 101;
    private static final int MSG_SATELLITES = 1;
    private static final int MSG_LOCATION = 2;

    private LocationManager locationManager;
    private RadarView radarView;
    private TextView tvFixStatus;
    private TextView tvSatelliteCount;
    private LinearLayout navicSatelliteList;
    private LinearLayout otherSatelliteList;
    private TextView tvNavicPlaceholder;
    private TextView tvOthersPlaceholder;
    private TextView tvNmeaLog;
    private TextView btnNmeaPause;
    private LinearLayout bannerPermission;
    private TextView btnGrantPermission;

    // Instrument HUD on Radar Screen
    private TextView tvRadarNavicStatus;
    private TextView tvRadarCoords;
    private TextView tvRadarAlt;

    // Constellation Breakdown Chips
    private TextView tvCountNavic;
    private TextView tvCountGps;
    private TextView tvCountGalileo;
    private TextView tvCountBeidou;
    private TextView tvCountGlonass;
    private TextView tvCountQzss;

    // Bottom Navigation Tabs
    private LinearLayout btnTabRadar;
    private LinearLayout btnTabSatellites;
    private LinearLayout btnTabNmea;
    private LinearLayout btnTabGuide;

    private ImageView iconTabRadar;
    private ImageView iconTabSatellites;
    private ImageView iconTabNmea;
    private ImageView iconTabGuide;

    private TextView labelTabRadar;
    private TextView labelTabSatellites;
    private TextView labelTabNmea;
    private TextView labelTabGuide;

    // Content Viewports
    private ScrollView viewTabRadar;
    private ScrollView viewTabSatellites;
    private LinearLayout viewTabNmea;
    private ScrollView viewTabGuide;

    // Glitch-free ring buffer for NMEA telemetry stream
    private final LinkedList<String> nmeaBuffer = new LinkedList<String>();
    private final GnssCallback gnssCallback = new GnssCallback(this);
    private Handler mainHandler;
    private boolean isMonitoring = false;
    private boolean isNmeaPaused = false;

    private int latestTotalSats = 0;
    private int latestTotalInFix = 0;
    private int latestNavicTot = 0, latestNavicFix = 0;
    private int latestGpsTot = 0, latestGpsFix = 0;
    private int latestGalileoTot = 0, latestGalileoFix = 0;
    private int latestBeidouTot = 0, latestBeidouFix = 0;
    private int latestGlonassTot = 0, latestGlonassFix = 0;
    private int latestQzssTot = 0, latestQzssFix = 0;
    private List<Satellite> latestNavicList = new ArrayList<Satellite>();
    private List<Satellite> latestOthersList = new ArrayList<Satellite>();
    private List<Satellite> latestAllList = new ArrayList<Satellite>();

    @Override
    public void run() {
        flushNmeaToUi();
        if (mainHandler != null && isMonitoring) {
            mainHandler.postDelayed(this, 250L);
        }
    }

    @Override
    public void onClick(View v) {
        if (v == null) return;
        int id = v.getId();
        if (id == R.id.btn_grant_permission) {
            requestLocationPermission();
        } else if (id == R.id.btn_tab_radar) {
            switchTab(0);
        } else if (id == R.id.btn_tab_satellites) {
            switchTab(1);
        } else if (id == R.id.btn_tab_nmea) {
            switchTab(2);
        } else if (id == R.id.btn_tab_guide) {
            switchTab(3);
        } else if (id == R.id.btn_nmea_pause) {
            isNmeaPaused = !isNmeaPaused;
            if (btnNmeaPause != null) {
                btnNmeaPause.setText(isNmeaPaused ? "RESUME" : "PAUSE");
                btnNmeaPause.setBackgroundColor(Color.parseColor(isNmeaPaused ? "#FF9933" : "#10B981"));
            }
        }
    }

    private void switchTab(int tabIndex) {
        if (viewTabRadar != null) viewTabRadar.setVisibility(tabIndex == 0 ? View.VISIBLE : View.GONE);
        if (viewTabSatellites != null) viewTabSatellites.setVisibility(tabIndex == 1 ? View.VISIBLE : View.GONE);
        if (viewTabNmea != null) viewTabNmea.setVisibility(tabIndex == 2 ? View.VISIBLE : View.GONE);
        if (viewTabGuide != null) viewTabGuide.setVisibility(tabIndex == 3 ? View.VISIBLE : View.GONE);

        updateTabItem(btnTabRadar, iconTabRadar, labelTabRadar, tabIndex == 0);
        updateTabItem(btnTabSatellites, iconTabSatellites, labelTabSatellites, tabIndex == 1);
        updateTabItem(btnTabNmea, iconTabNmea, labelTabNmea, tabIndex == 2);
        updateTabItem(btnTabGuide, iconTabGuide, labelTabGuide, tabIndex == 3);
    }

    private void updateTabItem(LinearLayout tab, ImageView icon, TextView label, boolean isSelected) {
        if (tab != null) {
            tab.setBackgroundResource(isSelected ? R.drawable.tab_bottom_active : 0);
        }
        int activeColor = Color.parseColor("#FF9933");
        int inactiveColor = Color.parseColor("#94A3B8");
        if (icon != null) {
            icon.setColorFilter(isSelected ? activeColor : inactiveColor);
        }
        if (label != null) {
            label.setTextColor(isSelected ? Color.parseColor("#FFFFFF") : inactiveColor);
            label.setTypeface(null, isSelected ? Typeface.BOLD : Typeface.NORMAL);
        }
    }

    public void onGnssStatusChanged(GnssStatus status) {
        int count = status.getSatelliteCount();
        List<Satellite> navicList = new ArrayList<Satellite>();
        List<Satellite> othersList = new ArrayList<Satellite>();
        List<Satellite> allList = new ArrayList<Satellite>();

        int totalInFix = 0;
        int nTot = 0, nFix = 0;
        int gTot = 0, gFix = 0;
        int eTot = 0, eFix = 0;
        int bTot = 0, bFix = 0;
        int rTot = 0, rFix = 0;
        int qTot = 0, qFix = 0;

        for (int i = 0; i < count; i++) {
            int type = status.getConstellationType(i);
            int svid = status.getSvid(i);
            float cn0 = status.getCn0DbHz(i);
            float elevation = status.getElevationDegrees(i);
            float azimuth = status.getAzimuthDegrees(i);
            boolean used = status.usedInFix(i);
            Float carrier = status.hasCarrierFrequencyHz(i) ? status.getCarrierFrequencyHz(i) : null;

            if (used) totalInFix++;

            String name = "Unknown";
            if (type == GnssStatus.CONSTELLATION_IRNSS) {
                name = "NavIC / IRNSS";
                nTot++;
                if (used) nFix++;
            } else if (type == GnssStatus.CONSTELLATION_GPS) {
                name = "GPS";
                gTot++;
                if (used) gFix++;
            } else if (type == GnssStatus.CONSTELLATION_GALILEO) {
                name = "Galileo";
                eTot++;
                if (used) eFix++;
            } else if (type == GnssStatus.CONSTELLATION_BEIDOU) {
                name = "BeiDou";
                bTot++;
                if (used) bFix++;
            } else if (type == GnssStatus.CONSTELLATION_GLONASS) {
                name = "GLONASS";
                rTot++;
                if (used) rFix++;
            } else if (type == GnssStatus.CONSTELLATION_QZSS || type == GnssStatus.CONSTELLATION_SBAS) {
                name = (type == GnssStatus.CONSTELLATION_SBAS) ? "GAGAN (SBAS)" : "QZSS";
                qTot++;
                if (used) qFix++;
            }

            Satellite sat = new Satellite(svid, type, name, cn0, elevation, azimuth, used, carrier);
            allList.add(sat);

            if (sat.isNavic) {
                navicList.add(sat);
            } else {
                othersList.add(sat);
            }
        }

        // Sort NavIC and others by fix & signal strength without synthetic classes
        sortSatellites(navicList);
        sortSatellites(othersList);

        synchronized (this) {
            this.latestTotalSats = count;
            this.latestTotalInFix = totalInFix;
            this.latestNavicTot = nTot;
            this.latestNavicFix = nFix;
            this.latestGpsTot = gTot;
            this.latestGpsFix = gFix;
            this.latestGalileoTot = eTot;
            this.latestGalileoFix = eFix;
            this.latestBeidouTot = bTot;
            this.latestBeidouFix = bFix;
            this.latestGlonassTot = rTot;
            this.latestGlonassFix = rFix;
            this.latestQzssTot = qTot;
            this.latestQzssFix = qFix;
            this.latestNavicList = navicList;
            this.latestOthersList = othersList;
            this.latestAllList = allList;
        }

        if (mainHandler != null) {
            mainHandler.sendEmptyMessage(MSG_SATELLITES);
        }
    }

    private void sortSatellites(List<Satellite> list) {
        if (list == null || list.size() < 2) return;
        for (int i = 0; i < list.size() - 1; i++) {
            for (int j = i + 1; j < list.size(); j++) {
                Satellite a = list.get(i);
                Satellite b = list.get(j);
                if (shouldSwapSatellites(a, b)) {
                    list.set(i, b);
                    list.set(j, a);
                }
            }
        }
    }

    private boolean shouldSwapSatellites(Satellite a, Satellite b) {
        if (a.usedInFix != b.usedInFix) {
            return !a.usedInFix && b.usedInFix;
        }
        return b.cn0DbHz > a.cn0DbHz;
    }

    @Override
    public boolean handleMessage(Message msg) {
        if (msg.what == MSG_SATELLITES) {
            renderSatellites();
            return true;
        } else if (msg.what == MSG_LOCATION) {
            if (msg.obj instanceof Location) {
                Location loc = (Location) msg.obj;
                String statusText = String.format("3D Fix: %.4f°, %.4f°", loc.getLatitude(), loc.getLongitude());
                if (loc.hasAccuracy()) {
                    statusText += String.format(" (±%.1fm)", loc.getAccuracy());
                }
                tvFixStatus.setText(statusText);

                if (tvRadarCoords != null) {
                    String coordText = String.format("Coordinates: %.5f° N, %.5f° E", loc.getLatitude(), loc.getLongitude());
                    if (loc.hasAccuracy()) {
                        coordText += String.format(" (±%.1fm)", loc.getAccuracy());
                    }
                    tvRadarCoords.setText(coordText);
                }

                if (tvRadarAlt != null) {
                    String altStr = loc.hasAltitude() ? String.format("Altitude: %.1fm", loc.getAltitude()) : "Altitude: MSL";
                    String spdStr = loc.hasSpeed() ? String.format("Speed: %.1f km/h", loc.getSpeed() * 3.6f) : "Speed: 0.0 km/h";
                    String bearStr = loc.hasBearing() ? String.format("Bearing: %.0f°", loc.getBearing()) : "Bearing: --°";
                    tvRadarAlt.setText(altStr + " • " + spdStr + " • " + bearStr);
                }
            }
            return true;
        }
        return false;
    }

    private void renderSatellites() {
        int total;
        int totalInFix;
        int nTot, nFix, gTot, gFix, eTot, eFix, bTot, bFix, rTot, rFix, qTot, qFix;
        List<Satellite> navicList;
        List<Satellite> othersList;
        List<Satellite> allList;

        synchronized (this) {
            total = this.latestTotalSats;
            totalInFix = this.latestTotalInFix;
            nTot = this.latestNavicTot;
            nFix = this.latestNavicFix;
            gTot = this.latestGpsTot;
            gFix = this.latestGpsFix;
            eTot = this.latestGalileoTot;
            eFix = this.latestGalileoFix;
            bTot = this.latestBeidouTot;
            bFix = this.latestBeidouFix;
            rTot = this.latestGlonassTot;
            rFix = this.latestGlonassFix;
            qTot = this.latestQzssTot;
            qFix = this.latestQzssFix;
            navicList = this.latestNavicList;
            othersList = this.latestOthersList;
            allList = this.latestAllList;
        }

        tvSatelliteCount.setText(total + " Sats (" + totalInFix + " in fix)");
        radarView.setSatellites(allList);

        // Update Constellation Breakdown Cards
        if (tvCountNavic != null) tvCountNavic.setText(nFix + " in fix (" + nTot + ")");
        if (tvCountGps != null) tvCountGps.setText(gFix + " in fix (" + gTot + ")");
        if (tvCountGalileo != null) tvCountGalileo.setText(eFix + " in fix (" + eTot + ")");
        if (tvCountBeidou != null) tvCountBeidou.setText(bFix + " in fix (" + bTot + ")");
        if (tvCountGlonass != null) tvCountGlonass.setText(rFix + " in fix (" + rTot + ")");
        if (tvCountQzss != null) tvCountQzss.setText(qFix + " in fix (" + qTot + ")");

        // Update Radar HUD info
        if (tvRadarNavicStatus != null) {
            if (navicList.isEmpty()) {
                tvRadarNavicStatus.setText("NavIC: Listening for IRNSS L5 & S-band...");
            } else {
                float minEl = 90f;
                float maxEl = 0f;
                for (int i = 0; i < navicList.size(); i++) {
                    Satellite s = navicList.get(i);
                    if (s.elevation < minEl) minEl = s.elevation;
                    if (s.elevation > maxEl) maxEl = s.elevation;
                }
                tvRadarNavicStatus.setText(String.format("NavIC: %d Satellites Locked at Zenith (%.0f°–%.0f°)",
                        navicList.size(), minEl, maxEl));
            }
        }

        LayoutInflater inflater = LayoutInflater.from(this);

        // Populate NavIC List
        navicSatelliteList.removeAllViews();
        if (navicList.isEmpty()) {
            navicSatelliteList.addView(tvNavicPlaceholder);
        } else {
            for (int i = 0; i < navicList.size(); i++) {
                Satellite sat = navicList.get(i);
                View row = inflater.inflate(R.layout.item_satellite, navicSatelliteList, false);
                TextView tvFlag = (TextView) row.findViewById(R.id.sat_flag);
                TextView tvPrn = (TextView) row.findViewById(R.id.sat_prn);
                TextView tvConst = (TextView) row.findViewById(R.id.sat_constellation);
                TextView tvCarrier = (TextView) row.findViewById(R.id.sat_carrier);
                TextView tvElAz = (TextView) row.findViewById(R.id.sat_el_az);
                TextView tvCn0 = (TextView) row.findViewById(R.id.sat_cn0);
                ProgressBar pb = (ProgressBar) row.findViewById(R.id.sat_progress);

                tvFlag.setVisibility(View.GONE); // Section header already displays 🇮🇳
                tvPrn.setText("PRN " + sat.prn);
                tvConst.setText(sat.getSatelliteName() + (sat.usedInFix ? " • 3D Fix" : ""));
                tvCarrier.setText(sat.getCarrierLabel());
                tvElAz.setText(String.format("El: %.0f°", sat.elevation));
                tvCn0.setText(String.format("%.1f dB", sat.cn0DbHz));
                pb.setProgress((int) sat.cn0DbHz);

                navicSatelliteList.addView(row);
            }
        }

        // Populate Others List with Country Flags (no arbitrary cap)
        otherSatelliteList.removeAllViews();
        if (othersList.isEmpty()) {
            otherSatelliteList.addView(tvOthersPlaceholder);
        } else {
            int displayCount = Math.min(othersList.size(), 30);
            for (int i = 0; i < displayCount; i++) {
                Satellite sat = othersList.get(i);
                View row = inflater.inflate(R.layout.item_satellite, otherSatelliteList, false);
                TextView tvFlag = (TextView) row.findViewById(R.id.sat_flag);
                TextView tvPrn = (TextView) row.findViewById(R.id.sat_prn);
                TextView tvConst = (TextView) row.findViewById(R.id.sat_constellation);
                TextView tvCarrier = (TextView) row.findViewById(R.id.sat_carrier);
                TextView tvElAz = (TextView) row.findViewById(R.id.sat_el_az);
                TextView tvCn0 = (TextView) row.findViewById(R.id.sat_cn0);
                ProgressBar pb = (ProgressBar) row.findViewById(R.id.sat_progress);

                tvFlag.setVisibility(View.VISIBLE);
                tvFlag.setText(sat.getFlag()); // Country flag (🇺🇸, 🇪🇺, 🇨🇳, 🇷🇺, 🇯🇵)
                tvPrn.setText("PRN " + sat.prn);
                tvConst.setText(sat.getSatelliteName() + (sat.usedInFix ? " • 3D Fix" : ""));
                tvCarrier.setText(sat.getCarrierLabel());
                tvElAz.setText(String.format("El: %.0f°", sat.elevation));
                tvCn0.setText(String.format("%.1f dB", sat.cn0DbHz));
                pb.setProgress((int) sat.cn0DbHz);

                otherSatelliteList.addView(row);
            }
        }
    }

    private void flushNmeaToUi() {
        if (isNmeaPaused) return;

        List<String> snapshot;
        synchronized (nmeaBuffer) {
            if (nmeaBuffer.isEmpty()) return;
            snapshot = new ArrayList<String>(nmeaBuffer);
        }

        // Dedicated NMEA screen can display up to 18 lines cleanly
        int start = Math.max(0, snapshot.size() - 18);
        StringBuilder sb = new StringBuilder();
        for (int i = start; i < snapshot.size(); i++) {
            String line = snapshot.get(i);
            if (line.startsWith("$GIGSV") || line.startsWith("$IRGSV") || line.startsWith("$IR")) {
                sb.append("🇮🇳 ").append(line);
            } else {
                sb.append("   ").append(line);
            }
            if (i < snapshot.size() - 1) {
                sb.append("\n");
            }
        }
        tvNmeaLog.setText(sb.toString());
    }

    @Override
    public void onLocationChanged(Location location) {
        if (mainHandler != null) {
            Message msg = mainHandler.obtainMessage(MSG_LOCATION, location);
            msg.sendToTarget();
        }
    }

    @Override public void onStatusChanged(String provider, int status, Bundle extras) {}
    @Override public void onProviderEnabled(String provider) {}
    @Override public void onProviderDisabled(String provider) {}

    @Override
    public void onNmeaMessage(String message, long timestamp) {
        if (message == null) return;
        String trimmed = message.trim();
        if (trimmed.isEmpty()) return;

        synchronized (nmeaBuffer) {
            nmeaBuffer.addLast(trimmed);
            if (nmeaBuffer.size() > 50) {
                nmeaBuffer.removeFirst();
            }
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
            getWindow().setStatusBarColor(Color.parseColor("#0A1024"));
            getWindow().setNavigationBarColor(Color.parseColor("#070B18"));
        }

        setContentView(R.layout.activity_main);

        mainHandler = new Handler(Looper.getMainLooper(), this);
        locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);

        radarView = (RadarView) findViewById(R.id.radar_view);
        tvFixStatus = (TextView) findViewById(R.id.tv_fix_status);
        tvSatelliteCount = (TextView) findViewById(R.id.tv_satellite_count);
        navicSatelliteList = (LinearLayout) findViewById(R.id.navic_satellite_list);
        otherSatelliteList = (LinearLayout) findViewById(R.id.other_satellite_list);
        tvNavicPlaceholder = (TextView) findViewById(R.id.tv_navic_placeholder);
        tvOthersPlaceholder = (TextView) findViewById(R.id.tv_others_placeholder);
        tvNmeaLog = (TextView) findViewById(R.id.tv_nmea_log);
        btnNmeaPause = (TextView) findViewById(R.id.btn_nmea_pause);
        bannerPermission = (LinearLayout) findViewById(R.id.banner_permission);
        btnGrantPermission = (TextView) findViewById(R.id.btn_grant_permission);

        tvRadarNavicStatus = (TextView) findViewById(R.id.tv_radar_navic_status);
        tvRadarCoords = (TextView) findViewById(R.id.tv_radar_coords);
        tvRadarAlt = (TextView) findViewById(R.id.tv_radar_alt);

        tvCountNavic = (TextView) findViewById(R.id.tv_count_navic);
        tvCountGps = (TextView) findViewById(R.id.tv_count_gps);
        tvCountGalileo = (TextView) findViewById(R.id.tv_count_galileo);
        tvCountBeidou = (TextView) findViewById(R.id.tv_count_beidou);
        tvCountGlonass = (TextView) findViewById(R.id.tv_count_glonass);
        tvCountQzss = (TextView) findViewById(R.id.tv_count_qzss);

        // Bottom Navigation
        btnTabRadar = (LinearLayout) findViewById(R.id.btn_tab_radar);
        btnTabSatellites = (LinearLayout) findViewById(R.id.btn_tab_satellites);
        btnTabNmea = (LinearLayout) findViewById(R.id.btn_tab_nmea);
        btnTabGuide = (LinearLayout) findViewById(R.id.btn_tab_guide);

        labelTabRadar = (TextView) findViewById(R.id.label_tab_radar);
        labelTabSatellites = (TextView) findViewById(R.id.label_tab_satellites);
        labelTabNmea = (TextView) findViewById(R.id.label_tab_nmea);
        labelTabGuide = (TextView) findViewById(R.id.label_tab_guide);

        iconTabRadar = (ImageView) findViewById(R.id.icon_tab_radar);
        iconTabSatellites = (ImageView) findViewById(R.id.icon_tab_satellites);
        iconTabNmea = (ImageView) findViewById(R.id.icon_tab_nmea);
        iconTabGuide = (ImageView) findViewById(R.id.icon_tab_guide);

        // Viewports
        viewTabRadar = (ScrollView) findViewById(R.id.view_tab_radar);
        viewTabSatellites = (ScrollView) findViewById(R.id.view_tab_satellites);
        viewTabNmea = (LinearLayout) findViewById(R.id.view_tab_nmea);
        viewTabGuide = (ScrollView) findViewById(R.id.view_tab_guide);

        btnGrantPermission.setOnClickListener(this);
        btnTabRadar.setOnClickListener(this);
        btnTabSatellites.setOnClickListener(this);
        btnTabNmea.setOnClickListener(this);
        btnTabGuide.setOnClickListener(this);
        if (btnNmeaPause != null) btnNmeaPause.setOnClickListener(this);

        checkAndRequestPermission();
    }

    @Override
    protected void onResume() {
        super.onResume();
        checkAndRequestPermission();
    }

    private void checkAndRequestPermission() {
        if (checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            if (bannerPermission != null) {
                bannerPermission.setVisibility(View.VISIBLE);
            }
            tvFixStatus.setText("Location permission required to access NavIC hardware.");
            requestLocationPermission();
        } else {
            if (bannerPermission != null) {
                bannerPermission.setVisibility(View.GONE);
            }
            startGnssMonitoring();
        }
    }

    private void requestLocationPermission() {
        requestPermissions(new String[]{
                Manifest.permission.ACCESS_FINE_LOCATION,
                Manifest.permission.ACCESS_COARSE_LOCATION
        }, REQ_PERMISSIONS);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == REQ_PERMISSIONS && grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            if (bannerPermission != null) {
                bannerPermission.setVisibility(View.GONE);
            }
            startGnssMonitoring();
        } else {
            if (bannerPermission != null) {
                bannerPermission.setVisibility(View.VISIBLE);
            }
            tvFixStatus.setText("Location permission denied. Tap GRANT above.");
        }
    }

    private void startGnssMonitoring() {
        if (isMonitoring) return;
        try {
            locationManager.registerGnssStatusCallback(gnssCallback);
            locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 1000L, 0.5f, this);
            locationManager.addNmeaListener(this);
            isMonitoring = true;

            // Start smooth, glitch-free 4 Hz NMEA terminal loop
            if (mainHandler != null) {
                mainHandler.post(this);
            }
        } catch (SecurityException se) {
            tvFixStatus.setText("SecurityException: location permission not granted.");
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (isMonitoring) {
            try {
                locationManager.unregisterGnssStatusCallback(gnssCallback);
                locationManager.removeUpdates(this);
                locationManager.removeNmeaListener(this);
            } catch (Exception ignored) {}
            isMonitoring = false;
        }
        if (mainHandler != null) {
            mainHandler.removeCallbacksAndMessages(null);
        }
    }
}
