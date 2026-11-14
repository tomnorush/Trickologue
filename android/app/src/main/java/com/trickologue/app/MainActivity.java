package com.trickologue.app;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Insets;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.AtomicFile;
import android.view.ViewGroup;
import android.view.WindowInsets;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * Trickologue for Android: one WebView showing the page bundled in assets/index.html
 * (built by tools/build.mjs from the same sources as the Scriptable script).
 *
 * The page keeps its state (ticked tricks, language, the tricker's own tricks and
 * levels) through the TQAndroid bridge below, in files/progress.json. That file is
 * the only thing the app stores, and Android's backup carries it to a new phone.
 */
public class MainActivity extends Activity {
    private static final String PAGE = "file:///android_asset/index.html";
    private static final int MAT = 0xFF0A0A0B;
    private static final int MAX_STATE_CHARS = 2_000_000;

    private WebView web;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(MAT);
        web = new WebView(this);
        web.setBackgroundColor(MAT);
        web.setOverScrollMode(WebView.OVER_SCROLL_NEVER);
        root.addView(web, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        setContentView(root);
        fitSystemBars(root);

        WebSettings settings = web.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setTextZoom(100);
        // Only the bundled page is ever shown: no files, no content providers, no other sites.
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);

        web.addJavascriptInterface(new Bridge(), "TQAndroid");
        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (PAGE.equals(uri.toString())) return false;
                // Booking, the book and Instagram open in the browser, never inside the app.
                String scheme = uri.getScheme();
                if ("https".equals(scheme) || "http".equals(scheme)) {
                    try {
                        startActivity(new Intent(Intent.ACTION_VIEW, uri));
                    } catch (ActivityNotFoundException ignored) {
                        // No browser installed: nothing to open the link with.
                    }
                }
                return true;
            }
        });
        web.loadUrl(PAGE);
    }

    /** Keep the page clear of the status bar, the navigation bar, cutouts and the keyboard. */
    private void fitSystemBars(FrameLayout root) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            getWindow().setDecorFitsSystemWindows(false);
            root.setOnApplyWindowInsetsListener((view, insets) -> {
                Insets bars = insets.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout() | WindowInsets.Type.ime());
                view.setPadding(bars.left, bars.top, bars.right, bars.bottom);
                return WindowInsets.CONSUMED;
            });
        }
        // Before Android 11 the system insets the window itself and resizes it for the keyboard.
    }

    @Override
    public void onBackPressed() {
        // Back closes the add / edit sheet if it is open, and leaves the app otherwise.
        web.evaluateJavascript("(window.tqBack&&window.tqBack())===true", value -> {
            if (!"true".equals(value)) finish();
        });
    }

    @Override
    protected void onPause() {
        // The page saves a moment after each change; make sure nothing is still waiting.
        web.evaluateJavascript("window.tqFlush&&window.tqFlush()", null);
        web.onPause();
        super.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        web.onResume();
    }

    @Override
    protected void onDestroy() {
        ViewGroup parent = (ViewGroup) web.getParent();
        if (parent != null) parent.removeView(web);
        web.destroy();
        super.onDestroy();
    }

    /** What the page calls as window.TQAndroid. Runs on a WebView thread, hence synchronized. */
    private final class Bridge {
        private final AtomicFile file = new AtomicFile(new File(getFilesDir(), "progress.json"));

        @JavascriptInterface
        public synchronized String load() {
            try {
                return new String(file.readFully(), StandardCharsets.UTF_8);
            } catch (IOException e) {
                return ""; // first launch, or nothing readable: the page starts empty
            }
        }

        @JavascriptInterface
        public synchronized void save(String json) {
            if (json == null || json.isEmpty() || json.length() > MAX_STATE_CHARS) return;
            FileOutputStream out = null;
            try {
                out = file.startWrite();
                out.write(json.getBytes(StandardCharsets.UTF_8));
                file.finishWrite(out); // the old file stays intact until the new one is complete
            } catch (IOException e) {
                if (out != null) file.failWrite(out);
            }
        }
    }
}
