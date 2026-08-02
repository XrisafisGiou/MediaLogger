package com.xrisafisgiou.medialogger;

import android.os.Build;
import android.os.Bundle;
import android.view.Window;
import android.view.WindowManager;

import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    private static final long FULLSCREEN_DELAY_MS = 250;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Window window = getWindow();

        // Force the activity itself into fullscreen mode.
        window.setFlags(
            WindowManager.LayoutParams.FLAG_FULLSCREEN,
            WindowManager.LayoutParams.FLAG_FULLSCREEN
        );

        // Let the WebView occupy the system-bar areas.
        WindowCompat.setDecorFitsSystemWindows(
            window,
            false
        );

        allowDisplayCutout(window);

        /*
         * Capacitor and the splash screen can update the window after
         * onCreate(), so reapply fullscreen after the first layout.
         */
        window.getDecorView().postDelayed(
            this::enterFullscreen,
            FULLSCREEN_DELAY_MS
        );
    }

    @Override
    public void onResume() {
        super.onResume();

        getWindow().getDecorView().postDelayed(
            this::enterFullscreen,
            FULLSCREEN_DELAY_MS
        );
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);

        if (hasFocus) {
            getWindow().getDecorView().postDelayed(
                this::enterFullscreen,
                FULLSCREEN_DELAY_MS
            );
        }
    }

    private void allowDisplayCutout(Window window) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.P) {
            return;
        }

        WindowManager.LayoutParams attributes =
            window.getAttributes();

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            attributes.layoutInDisplayCutoutMode =
                WindowManager.LayoutParams
                    .LAYOUT_IN_DISPLAY_CUTOUT_MODE_ALWAYS;
        } else {
            attributes.layoutInDisplayCutoutMode =
                WindowManager.LayoutParams
                    .LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
        }

        window.setAttributes(attributes);
    }

    private void enterFullscreen() {
        Window window = getWindow();

        WindowCompat.setDecorFitsSystemWindows(
            window,
            false
        );

        WindowInsetsControllerCompat controller =
            WindowCompat.getInsetsController(
                window,
                window.getDecorView()
            );

        controller.setSystemBarsBehavior(
            WindowInsetsControllerCompat
                .BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
        );

        controller.hide(
            WindowInsetsCompat.Type.systemBars()
        );
    }
}