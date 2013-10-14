/*
 Creates an mm_track URL, used for tracking page views to Comscore.
 */
(function ($, window, document, location) {

	"use strict";

	var encode = encodeURIComponent,
		protocol = location.protocol,
		host = location.hostname,

		// Disable tracking in developer sandboxes.
		isSandbox = /\.sandbox\./.test(host) || location.search.match('track=sandbox'),
		mmTrackIframe,
		mmTrackIframeStyle;

	$.mmTrack = function (omnitureConfig) {
		if (isSandbox) {
			if (window.console) {
				console.info("jQuery.mmTrack: Comscore tracking is disabled in sandbox.");
			}
		} else {

			var omnitureObj = window.s_265,
			omnitureAccount = "",
			omnitureChannel = "",
			omnitureProp1 = "",
			omnitureProp2 = "",
			omnitureEnabled = "",
			omniturePageName = "?title=" + encode(document.title),
			mmTrackUrl;

			if (omnitureObj || omnitureConfig) {

				if (omnitureConfig.isInternational) {
					// Merged prop17 and prop21 with omni=2, which will get initiated only on International blogs.
					// Passing the pfxID value to mm_track via GET vars - Ramesh Kumar
					omnitureEnabled = "&omni=2&pfxID=" + omnitureObj.pfxID + "&sprop17=" + omnitureObj.prop17 + "&sprop21=" + omnitureObj.prop21;
				} else {
					omnitureEnabled = "&omni=1";
				}

				// Set Omniture account
				if (omnitureConfig.s_account) {
					omnitureAccount = "&s_account=" + omnitureConfig.s_account;
				} else if (window.s_account) {
					omnitureAccount = "&s_account=" + window.s_account;
				}

				// Set Omniture channel
				if (omnitureConfig.channel) {
					omnitureChannel = "&s_channel=" + omnitureConfig.channel;
				} else if (omnitureObj.channel) {
					omnitureChannel = "&s_channel=" + omnitureObj.channel;
				}

				// Set Omniture Prop 1
				if (omnitureConfig.prop1) {
					omnitureProp1 = omnitureConfig.prop1 + "/";
				} else if (omnitureObj.prop1) {
					omnitureProp1 = omnitureObj.prop1 + "/";
				}

				// Set Omniture Prop 2
				if (omnitureConfig.prop2) {
					omnitureProp2 = omnitureConfig.prop2 + "/";
				} else if (omnitureObj.prop2) {
					omnitureProp2 = omnitureObj.prop2 + "/";
				}

				// Set Omniture Page Name
				if (omnitureConfig.pageName) {
					omniturePageName = "?title=" + encode(omnitureConfig.pageName);
				} else if (omnitureObj.channel) {
					omniturePageName = "?title=" + encode(omnitureObj.pageName);
				}

			}

			if (!mmTrackIframe) {
				mmTrackIframe = document.createElement("iframe");
				mmTrackIframeStyle = mmTrackIframe.style;
				mmTrackIframe.id = "aol-mmtrack";
				mmTrackIframeStyle.display = "none";

				$(document.body).append(mmTrackIframe);
			}

			var tempOmni = {};
			
				$.each(omnitureConfig, function (key, val) {
					if (typeof omnitureConfig[key] === 'string') {
						if (key.match(/^prop/gi) && val !== '') {
							tempOmni['s' + key.toLowerCase()] = val;
						} else if (key.match(/^eVar/gi) && val !== '') {
							var tempKey = key.toLowerCase();
							tempOmni[tempKey] = val;
						} else if (
							key === 'account' ||
							key === 'channel' ||
							key === 'pageName' ||
							key === 'products' ||
							key === 'events'
						) {
							tempOmni[key] = val;
						}
					}
				});

			mmTrackUrl = protocol + "//" +
				(omnitureConfig.host || host) + "/mm_track/" + 
				omnitureProp1 + omnitureProp2 +
				omniturePageName + omnitureEnabled +
				'&' + $.param(tempOmni);
				
			mmTrackIframe.src = mmTrackUrl + "&ts=" + (+new Date());

			// Fire DataLayer Beacon vanity call, if the beacon object exists.
			if (window.bN_cfg) {
				window.bN.view();
			} else {
				if (window.console) {
					console.info("AOL DataLayer Beacon is not configured.");
				}
			}
		}
	};
	
})(jQuery, window, document, location);
