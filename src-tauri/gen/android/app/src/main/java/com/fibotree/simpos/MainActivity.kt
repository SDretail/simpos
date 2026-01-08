package com.fibotree.simpos

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import android.webkit.WebView
import android.webkit.WebSettings
import android.webkit.WebViewClient
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.ConsoleMessage
import android.util.Log
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import androidx.webkit.WebViewAssetLoader
import android.content.Context
import android.widget.Toast

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val webView = WebView(this)
        setContentView(webView)
        
        val settings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.allowFileAccess = true
        settings.allowContentAccess = true
        
        // Enable remote debugging
        WebView.setWebContentsDebuggingEnabled(true)

        // Initialize AssetLoader for CORS-safe local asset loading
        val assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler("/", WebViewAssetLoader.AssetsPathHandler(this))
            .setDomain("app.assets")
            .build()

        webView.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(view: WebView, request: WebResourceRequest): WebResourceResponse? {
                Log.d("WebViewNetwork", "${request.method}: ${request.url}")
                val response = assetLoader.shouldInterceptRequest(request.url)
                if (response != null && request.url.toString().endsWith(".js")) {
                    response.mimeType = "text/javascript"
                }
                return response
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onConsoleMessage(consoleMessage: ConsoleMessage): Boolean {
                Log.d("WebViewConsole", "${consoleMessage.message()} -- From line ${consoleMessage.lineNumber()} of ${consoleMessage.sourceId()}")
                return true
            }
        }

        // Inject Native Bridge
        webView.addJavascriptInterface(WebAppInterface(this), "Android")
        
        // Load from virtual domain
        webView.loadUrl("https://app.assets/index.html") 
    }

    /**
     * Native Bridge Interface
     */
    class WebAppInterface(private val mContext: Context) {
        /** Show a toast from the web page  */
        @JavascriptInterface
        fun showToast(toast: String) {
            Toast.makeText(mContext, toast, Toast.LENGTH_SHORT).show()
        }

        @JavascriptInterface
        fun getAndroidVersion(): String {
            return android.os.Build.VERSION.RELEASE
        }
    }
}