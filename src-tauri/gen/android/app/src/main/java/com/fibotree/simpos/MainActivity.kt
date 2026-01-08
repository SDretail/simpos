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
import com.sunmi.peripheral.printer.InnerPrinterCallback
import com.sunmi.peripheral.printer.InnerPrinterException
import com.sunmi.peripheral.printer.InnerPrinterManager
import com.sunmi.peripheral.printer.SunmiPrinterService
import android.graphics.BitmapFactory
import android.util.Base64

class MainActivity : AppCompatActivity() {
    private var sunmiPrinterService: SunmiPrinterService? = null
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
        webView.addJavascriptInterface(SimposInterface(this), "simpos")

        initPrinter()
        
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

    private fun initPrinter() {
        try {
            val callback = object : InnerPrinterCallback() {
                override fun onConnected(service: SunmiPrinterService) {
                    sunmiPrinterService = service
                    Log.d("SunmiPrinter", "Printer connected")
                }

                override fun onDisconnected() {
                    sunmiPrinterService = null
                    Log.d("SunmiPrinter", "Printer disconnected")
                }
            }
            val result = InnerPrinterManager.getInstance().bindService(this, callback)
            Log.d("SunmiPrinter", "Bind service result: $result")
        } catch (e: InnerPrinterException) {
             Log.e("SunmiPrinter", "Error binding service", e)
        }
    }

    inner class SimposInterface(private val mContext: Context) {
         @JavascriptInterface
         fun printReceipt(base64Image: String) {
             try {
                 if (sunmiPrinterService == null) {
                     Log.e("SunmiPrinter", "Printer service not connected")
                     Toast.makeText(mContext, "Printer not connected", Toast.LENGTH_SHORT).show()
                     return
                 }

                 val decodedString = Base64.decode(base64Image, Base64.DEFAULT)
                 val bitmap = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.size)
                 
                 sunmiPrinterService?.enterPrinterBuffer(true)
                 sunmiPrinterService?.printBitmap(bitmap, null)
                 sunmiPrinterService?.lineWrap(3, null)
                 sunmiPrinterService?.commitPrinterBuffer()
                 Log.d("SunmiPrinter", "Print receipt command sent")

             } catch (e: Exception) {
                 Log.e("SunmiPrinter", "Error printing receipt", e)
                 Toast.makeText(mContext, "Error printing: ${e.message}", Toast.LENGTH_SHORT).show()
             }
         }

         @JavascriptInterface
         fun printRestaurantOrder(data: String) {
             Log.d("SunmiPrinter", "printRestaurantOrder called with: $data")
         }
    }
}