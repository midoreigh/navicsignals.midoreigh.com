package com.midoreigh.navicsignals;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.DashPathEffect;
import android.graphics.Paint;
import android.util.AttributeSet;
import android.view.View;

public class OrbitSimulationView extends View {

    private final Paint gridPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint textPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint navicPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint navicHaloPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint gpsPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint labelPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint zenithHighlightPaint = new Paint(Paint.ANTI_ALIAS_FLAG);

    private float timeHours = 10.0f; // 0.0 to 24.0

    public OrbitSimulationView(Context context) {
        super(context);
        init();
    }

    public OrbitSimulationView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    private void init() {
        gridPaint.setColor(Color.parseColor("#1E293B"));
        gridPaint.setStyle(Paint.Style.STROKE);
        gridPaint.setStrokeWidth(2f);

        textPaint.setColor(Color.parseColor("#64748B"));
        textPaint.setTextSize(20f);
        textPaint.setTextAlign(Paint.Align.CENTER);

        navicPaint.setColor(Color.parseColor("#FF9933"));
        navicPaint.setStyle(Paint.Style.FILL);

        navicHaloPaint.setColor(Color.parseColor("#33FF9933"));
        navicHaloPaint.setStyle(Paint.Style.FILL);

        zenithHighlightPaint.setColor(Color.parseColor("#1AFF9933"));
        zenithHighlightPaint.setStyle(Paint.Style.FILL);

        gpsPaint.setColor(Color.parseColor("#38BDF8"));
        gpsPaint.setStyle(Paint.Style.FILL);

        labelPaint.setColor(Color.parseColor("#E2E8F0"));
        labelPaint.setTextSize(14f);
        labelPaint.setTextAlign(Paint.Align.CENTER);
        labelPaint.setFakeBoldText(true);
    }

    public void setTimeHours(float hours) {
        this.timeHours = (hours >= 0 && hours <= 24) ? hours : hours % 24f;
        invalidate();
    }

    public float getTimeHours() {
        return timeHours;
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);

        float cx = getWidth() / 2f;
        float cy = getHeight() / 2f;
        float maxR = Math.min(cx, cy) - 24f;

        if (maxR <= 0) return;

        // Dark sky dome
        Paint bgPaint = new Paint();
        bgPaint.setColor(Color.parseColor("#040817"));
        canvas.drawCircle(cx, cy, maxR, bgPaint);

        // Zenith safe zone (70°-90° elevation)
        canvas.drawCircle(cx, cy, maxR * 0.22f, zenithHighlightPaint);

        // Elevation rings
        canvas.drawCircle(cx, cy, maxR, gridPaint); // Horizon 0°
        canvas.drawCircle(cx, cy, maxR * 0.66f, gridPaint); // 30°
        canvas.drawCircle(cx, cy, maxR * 0.33f, gridPaint); // 60°

        // Crosshairs
        canvas.drawLine(cx, cy - maxR, cx, cy + maxR, gridPaint);
        canvas.drawLine(cx - maxR, cy, cx + maxR, cy, gridPaint);

        // Cardinal directions
        canvas.drawText("N", cx, cy - maxR - 4f, textPaint);
        canvas.drawText("S", cx, cy + maxR + 18f, textPaint);
        canvas.drawText("E", cx + maxR + 12f, cy + 6f, textPaint);
        canvas.drawText("W", cx - maxR - 12f, cy + 6f, textPaint);

        // Zenith center dot
        Paint zenithDot = new Paint(Paint.ANTI_ALIAS_FLAG);
        zenithDot.setColor(Color.parseColor("#0284C7"));
        canvas.drawCircle(cx, cy, 4f, zenithDot);

        double theta = (timeHours / 24.0) * 2 * Math.PI;

        // NavIC GEO 1: IRNSS-1C (83°E) - 100% STATIONARY near Zenith
        float cAz = 178f;
        float cEl = 79f;
        drawSatellite(canvas, cx, cy, maxR, cAz, cEl, "IRNSS-1C", true, true);

        // NavIC GEO 2: IRNSS-1F (32.5°E) - STATIONARY Western Sky
        float fAz = 245f;
        float fEl = 51f;
        drawSatellite(canvas, cx, cy, maxR, fAz, fEl, "IRNSS-1F", true, false);

        // NavIC GEO 3: IRNSS-1G (129.5°E) - STATIONARY Eastern Sky
        float gAz = 110f;
        float gEl = 42f;
        drawSatellite(canvas, cx, cy, maxR, gAz, gEl, "IRNSS-1G", true, false);

        // NavIC GSO: IRNSS-1B & 1I (55°E) - Figure-8 Loop
        float bAz = (float) (152 + 10 * Math.sin(2 * theta));
        float bEl = (float) (68 + 12 * Math.sin(theta));
        drawSatellite(canvas, cx, cy, maxR, bAz, bEl, "IRNSS-1B", true, false);

        float iAz = (float) (156 + 10 * Math.sin(2 * (theta + Math.PI)));
        float iEl = (float) (72 + 12 * Math.sin(theta + Math.PI));
        drawSatellite(canvas, cx, cy, maxR, iAz, iEl, "IRNSS-1I", true, false);

        // GPS Satellites - Moving fast across the sky & setting!
        drawGpsSatellite(canvas, cx, cy, maxR, timeHours, 0f, 40f, 55f, "GPS-18");
        drawGpsSatellite(canvas, cx, cy, maxR, timeHours, 6f, 210f, 62f, "GPS-24");
        drawGpsSatellite(canvas, cx, cy, maxR, timeHours, 12f, 310f, 48f, "GPS-12");
    }

    private void drawSatellite(Canvas canvas, float cx, float cy, float maxR, float azimuth, float elevation, String name, boolean isNavic, boolean isZenithPulsing) {
        float r = ((90f - Math.max(0, elevation)) / 90f) * maxR;
        double angleRad = Math.toRadians(azimuth - 90);
        float sx = (float) (cx + r * Math.cos(angleRad));
        float sy = (float) (cy + r * Math.sin(angleRad));

        if (isZenithPulsing) {
            canvas.drawCircle(sx, sy, 20f, navicHaloPaint);
        }

        canvas.drawCircle(sx, sy, isNavic ? 11f : 8f, isNavic ? navicPaint : gpsPaint);

        labelPaint.setColor(isNavic ? Color.parseColor("#FED7AA") : Color.parseColor("#BAE6FD"));
        canvas.drawText(name, sx, sy - 14f, labelPaint);

        if (isZenithPulsing) {
            Paint staticPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
            staticPaint.setColor(Color.parseColor("#F97316"));
            staticPaint.setTextSize(10f);
            staticPaint.setTextAlign(Paint.Align.CENTER);
            staticPaint.setFakeBoldText(true);
            canvas.drawText("[STATIONARY]", sx, sy + 18f, staticPaint);
        }
    }

    private void drawGpsSatellite(Canvas canvas, float cx, float cy, float maxR, float time, float phaseOffset, float startAz, float peakEl, String name) {
        double orbitPhase = (((time * 2.0 + phaseOffset) % 24.0) / 24.0) * 2 * Math.PI;
        double sinPhase = Math.sin(orbitPhase);

        if (sinPhase > 0.35) {
            // Above horizon
            float normalized = (float) ((sinPhase - 0.35) / 0.65);
            float el = normalized * peakEl;
            float sweep = (float) ((Math.cos(orbitPhase) + 1.0) / 2.0);
            float az = (startAz + sweep * 110f) % 360f;

            drawSatellite(canvas, cx, cy, maxR, az, el, name, false, false);
        }
    }
}
