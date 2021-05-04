#include <stdio.h>
#include <iostream>
#include "timeseries.cpp"
#include "SimpleAnomalyDetector.cpp"
#include "anomaly_detection_util.cpp"
#include "minCircle.cpp"
#include <node.h>
#include <sstream>
 
namespace learnNormal {
    using v8::Context;
    using v8::Function;
    using v8::FunctionCallbackInfo;
    using v8::FunctionTemplate;
    using v8::Isolate;
    using v8::Local;
    using v8::Number;
    using v8::Object;
    using v8::Persistent;
    using v8::String;
    using v8::Value;
    using v8::Array;
    using v8::Exception;

    SimpleAnomalyDetector sad;

    void Learn(const FunctionCallbackInfo<Value>&args) {
        TimeSeries tsTrain(*v8::String::Utf8Value(args[0])); 
	    sad.learnNormal(tsTrain);
    }


    //checks if the two ranges overlap at any point
	bool containsOverlap(float a, float b, float x, float y) {
		//if a-b is before/in x-y
		if (a <= x && b <= y && b >= x)
			return true;
		//if x-y is before/in a-b
		if (x <= a && y <= b && y >= a)
			return true;
		//if one is fully inside the other
		if ((x <= a && y >= b) || (a <= x && b >= y))
			return true;
		return false;
	}




    // a way to save the range of anomalies
    class ContinuousAnomalies {
    public:
    	const string description;
    	const long firstTimeStep;
    	const long lastTimeStep;
    	ContinuousAnomalies(string description, long firstTimeStep, long lastTimeStep):
    			description(description),firstTimeStep(firstTimeStep),lastTimeStep(lastTimeStep){}

    	// recieves vector of AnomalyReports and if we have sequential anomalies, we save the first and last position.
    	static vector<ContinuousAnomalies> findContinuousAnomalies(vector<AnomalyReport> ars) {
    		vector<ContinuousAnomalies> continuousAnomalies;
    		bool first = true;
    		string currentDescription;
    		long firstTS;
    		long lastTS;
    		for (AnomalyReport ar: ars) {
    			//first time we go in we initialize
    			if (first) {
    				currentDescription = ar.description;
    				firstTS = ar.timeStep;
    				lastTS = firstTS;
    				first = false;
    			} else {
    				//if we're in the same cf, check if the time step is continuous
    				if (ar.description == currentDescription) {
    					if (ar.timeStep != lastTS + 1) {
    						continuousAnomalies.push_back(ContinuousAnomalies(currentDescription, firstTS, lastTS));
    						firstTS = ar.timeStep;
    					}
    					lastTS = ar.timeStep;
    				} else {
    					//if the descriptions don't match
    					continuousAnomalies.push_back(ContinuousAnomalies(currentDescription, firstTS, lastTS));
    					firstTS = ar.timeStep;
    					lastTS = firstTS;
    					currentDescription = ar.description;
    				}
    			}
    		}
    		//pushes the final anomaly
    		continuousAnomalies.push_back(ContinuousAnomalies(currentDescription, firstTS, lastTS));
    		return continuousAnomalies;
    	}
    };



    void Detect(const FunctionCallbackInfo<Value>&args) {
        Isolate* isolate = args.GetIsolate();
	    TimeSeries tsTest(*v8::String::Utf8Value(args[0]));
	    std::vector<AnomalyReport> anomalyReportVec = sad.detect(tsTest);
        vector<ContinuousAnomalies> continuousAnomalies = ContinuousAnomalies::findContinuousAnomalies(anomalyReportVec);

        string str = "{\n";
	    	for (int i = 0; i < continuousAnomalies.size(); i++) {
                str += "\"Anonamly_" + to_string(i) + "\": {\n\"Description\":\"" + continuousAnomalies[i].description 
                + "\",\n\"start\":" + to_string(continuousAnomalies[i].firstTimeStep) + ",\n"
                + "\"end\":" + to_string(continuousAnomalies[i].lastTimeStep) + '\n';
                (i == continuousAnomalies.size() - 1) ? str += "}\n}" : str += "},\n";
	    	}
        args.GetReturnValue().Set(String::NewFromUtf8(isolate, str.c_str()));
    }



    void Initialize(Local<Object> exports) {
        NODE_SET_METHOD(exports, "learnN", Learn);
        NODE_SET_METHOD(exports, "detect", Detect);
    }

    NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize);


}
