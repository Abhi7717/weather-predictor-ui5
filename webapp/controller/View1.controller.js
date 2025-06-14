sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function(Controller, JSONModel, MessageToast) {
    "use strict";
  
    return Controller.extend("aditi.gyansys.project7.controller.View1", {
        onInit: function() {
            this.getView().setModel(new JSONModel(), "weather");
            // Set default background class
            this.getView().addStyleClass("default-bg");
        },
        
        onPress: function() {
            var city = this.byId("hlo").getValue();
            if (!city) {
                MessageToast.show("Please enter a city name");
                return;
            }
            this.loadWeatherData(city, "metric");
        },
        
        loadWeatherData: function(query, unit) {
            var oView = this.getView();
            var oModel = oView.getModel("weather");
            var sUrl = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=4fc56c42c8eba8f25fb55e31e25fe6cf&units=${unit}`;
            
            oModel.loadData(sUrl, null, false, "GET");
            oModel.attachRequestCompleted(function() {
                var weatherMain = oModel.getProperty("/weather/0/main");
                this.updateBackground(weatherMain);
            }.bind(this));
        },
        
        updateBackground: function(weatherCondition) {
            var oView = this.getView();
            
            // First remove all possible weather classes
            var weatherClasses = [
                "default-bg", 
                "clear-sky-bg",
                "cloudy-bg",
                "rainy-bg",
                "stormy-bg",
                "snowy-bg",
                "foggy-bg"
            ];
            
            weatherClasses.forEach(function(className) {
                oView.removeStyleClass(className);
            });
            
            // Add the appropriate class based on weather
            var newClass = "default-bg";
            if (weatherCondition) {
                weatherCondition = weatherCondition.toLowerCase();
                
                if (weatherCondition.includes("clear")) {
                    newClass = "clear-sky-bg";
                } else if (weatherCondition.includes("cloud")) {
                    newClass = "cloudy-bg";
                } else if (weatherCondition.includes("rain") || weatherCondition.includes("drizzle")) {
                    newClass = "rainy-bg";
                } else if (weatherCondition.includes("thunder")) {
                    newClass = "stormy-bg";
                } else if (weatherCondition.includes("snow")) {
                    newClass = "snowy-bg";
                } else if (weatherCondition.includes("mist") || weatherCondition.includes("fog") || 
                          weatherCondition.includes("haze")) {
                    newClass = "foggy-bg";
                }
            }
            
            oView.addStyleClass(newClass);
        }
    });
});