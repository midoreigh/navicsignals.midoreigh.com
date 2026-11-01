package com.midoreigh.navicsignals;

import android.location.GnssStatus;

public class GnssCallback extends GnssStatus.Callback {
    private final MainActivity activity;

    public GnssCallback(MainActivity activity) {
        this.activity = activity;
    }

    @Override
    public void onSatelliteStatusChanged(GnssStatus status) {
        if (activity != null) {
            activity.onGnssStatusChanged(status);
        }
    }
}
