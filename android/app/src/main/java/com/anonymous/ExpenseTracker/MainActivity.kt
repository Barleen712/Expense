package com.anonymous.BarleenExpenseTracker

import android.os.Build
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import org.devio.rn.splashscreen.SplashScreen;
import expo.modules.ReactActivityDelegateWrapper

class MainActivity : ReactActivity() {

   override fun onCreate(savedInstanceState: Bundle?) {
    SplashScreen.show(this)
    super.onCreate(null)
}

  override fun getMainComponentName(): String = "main"

override fun createReactActivityDelegate(): ReactActivityDelegate {
    return ReactActivityDelegateWrapper(
        this,
        BuildConfig.IS_NEW_ARCHITECTURE_ENABLED,
        object : DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled) {
            override fun createRootView(): com.facebook.react.ReactRootView {
                val reactRootView = super.createRootView()!!

                reactRootView.addOnAttachStateChangeListener(object : android.view.View.OnAttachStateChangeListener {
                    override fun onViewAttachedToWindow(v: android.view.View) {
                        runOnUiThread {
                            setTheme(R.style.AppTheme)
                        }
                        reactRootView.removeOnAttachStateChangeListener(this)
                    }
                    override fun onViewDetachedFromWindow(v: android.view.View) {}
                })

                return reactRootView
            }
        }
    )
}



  override fun invokeDefaultOnBackPressed() {
    if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.R) {
      if (!moveTaskToBack(false)) {
        super.invokeDefaultOnBackPressed()
      }
      return
    }
    super.invokeDefaultOnBackPressed()
  }
}