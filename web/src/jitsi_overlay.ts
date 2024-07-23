import $ from "jquery";

import render_jitsi_overlay from "../templates/jitsi_overlay.hbs";

import * as overlays from "./overlays";

export function initialize(): void {
    $(document).on('click', '[href*="jitsi-meet"]:not(.jitsi-overlay-url)', function(aEvent: MouseEvent) { // Only listen to a tags that have jitsi-meet on them, but are not the overlay urls.
        aEvent.preventDefault(); // Don't navigate with these links (yet).

        if (aEvent.currentTarget != null) { // Only show if the target is populated.
            fetch('accounts/login/generatejwt/').then((aResponse: Response) => { // Generate JWT URL.
                aResponse.json().then((aValue: any) => {
                    let schemeDeep = 'jitsi-meet'; // Deep Link Application URL protocol.
                    let schemeSecure = 'https'; // Regular secure HTTPS URL protocol.

                    let appToken = (aValue.result === "success") ? "&jwt=" + aValue.token : ""; // If the request was successful, get token from the json response and prepare it for appending to url. Default value of app token is blank.
                    let appUrl = (aEvent.currentTarget as HTMLAnchorElement).href + appToken; // Get the original link and append the app jwt token.
                    let webUrl = appUrl.replace(schemeDeep, schemeSecure); // Replace the "Application" protocol with the "Web" secure protocol for the web version.
                    $('#jitsi-app').attr('href', appUrl); // Update the Application link in the overlay.
                    $('#jitsi-web').attr('href', webUrl); // Update the Web link in the overlay.

                    if (overlays.any_active()) {
                        window.open(appUrl); // When in drafts, open the app url externally instead of showing the popup.
                    } else {
                        // Typical processing is to show the overlay where you can click either the app or web popup.
                        overlays.open_overlay({
                            name: "jitsi-overlay",
                            $overlay: $("#jitsi-overlay"),
                            on_close() {
                                
                            },
                        });
                    }

                });

            });
        }
    });

    const rendered_jitsi_overlay = render_jitsi_overlay({}); // Render the overlay html.
    $("#jitsi-overlay-modal-container").append(rendered_jitsi_overlay); // Put the overlay html on the page, ready for future use.
}
