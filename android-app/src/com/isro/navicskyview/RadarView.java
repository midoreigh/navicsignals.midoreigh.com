package com.isro.navicskyview;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.util.AttributeSet;
import android.view.View;

import java.util.ArrayList;
import java.util.List;

public class RadarView extends View {

    private final Paint gridPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint textPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint navicPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint otherPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint prnTextPaint = new Paint(Paint.ANTI_ALIAS_FLAG);

    private List<Satellite> satellites = new ArrayList<>();

    public RadarView(Context context) {
        super(context);
        init();
    }

    public RadarView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    private void init() {
        gridPaint.setColor(Color.parseColor("#1E293B"));
        gridPaint.setStyle(Paint.Style.STROKE);
        gridPaint.setStrokeWidth(2f);

        textPaint.setColor(Color.parseColor("#64748B"));
        textPaint.setTextSize(22f);
        textPaint.setTextAlign(Paint.Align.CENTER);

        navicPaint.setColor(Color.parseColor("#FF9933"));
        navicPaint.setStyle(Paint.Style.FILL);

        otherPaint.setColor(Color.parseColor("#38BDF8"));
        otherPaint.setStyle(Paint.Style.FILL);

        prnTextPaint.setColor(Color.parseColor("#050814"));
        prnTextPaint.setTextSize(16f);
        prnTextPaint.setTextAlign(Paint.Align.CENTER);
        prnTextPaint.setFakeBoldText(true);
    }

    public void setSatellites(List<Satellite> sats) {
        this.satellites = (sats != null) ? sats : new ArrayList<>();
        invalidate();
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);

        float cx = getWidth() / 2f;
        float cy = getHeight() / 2f;
        float maxR = Math.min(cx, cy) - 28f;

        if (maxR <= 0) return;

        // Draw radar rings
        gridPaint.setPathEffect(null);
        canvas.drawCircle(cx, cy, maxR, gridPaint); // 0 deg horizon
        canvas.drawCircle(cx, cy, maxR * 0.66f, gridPaint); // 30 deg elevation
        canvas.drawCircle(cx, cy, maxR * 0.33f, gridPaint); // 60 deg elevation

        // Zenith center point
        Paint zenithPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        zenithPaint.setColor(Color.parseColor("#0284C7"));
        canvas.drawCircle(cx, cy, 5f, zenithPaint);

        // Crosshairs
        canvas.drawLine(cx, cy - maxR, cx, cy + maxR, gridPaint);
        canvas.drawLine(cx - maxR, cy, cx + maxR, cy, gridPaint);

        // Cardinal directions
        canvas.drawText("N", cx, cy - maxR - 6f, textPaint);
        canvas.drawText("S", cx, cy + maxR + 20f, textPaint);
        canvas.drawText("E", cx + maxR + 14f, cy + 8f, textPaint);
        canvas.drawText("W", cx - maxR - 14f, cy + 8f, textPaint);

        // Plot satellites on clean skyplot
        for (Satellite sat : satellites) {
            float r = ((90f - sat.elevation) / 90f) * maxR;
            double angleRad = Math.toRadians(sat.azimuth - 90);
            float sx = (float) (cx + r * Math.cos(angleRad));
            float sy = (float) (cy + r * Math.sin(angleRad));

            if (sat.isNavic) {
                // Saffron glow ring
                Paint haloPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
                haloPaint.setColor(Color.parseColor("#55FF9933"));
                canvas.drawCircle(sx, sy, 18f, haloPaint);

                // Main saffron body
                canvas.drawCircle(sx, sy, 12f, navicPaint);
                canvas.drawText(String.valueOf(sat.prn), sx, sy + 5f, prnTextPaint);
            } else {
                // Satellite dot
                canvas.drawCircle(sx, sy, 9f, otherPaint);
                Paint pText = new Paint(Paint.ANTI_ALIAS_FLAG);
                pText.setColor(Color.parseColor("#050814"));
                pText.setTextSize(11f);
                pText.setTextAlign(Paint.Align.CENTER);
                pText.setFakeBoldText(true);
                canvas.drawText(String.valueOf(sat.prn), sx, sy + 4f, pText);
            }
        }
    }
}
