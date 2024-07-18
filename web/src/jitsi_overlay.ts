import $ from "jquery";

import render_jitsi_overlay from "../templates/jitsi_overlay.hbs";

import * as overlays from "./overlays";

export function initialize(): void {
    let facebookDeep = 'jitsi-meet://'; // Deep Link Application URL protocol.
    let facebookSecure = 'https://'; // Regular secure HTTPS URL protocol.

    $(document).on('click', '[href*="jitsi-meet"]:not(.jitsi-overlay-url)', function(aEvent: MouseEvent) { // Only listen to a tags that have jitsi-meet on them, but are not the overlay urls.
        aEvent.preventDefault(); // Don't navigate with these links (yet).

        if (aEvent.currentTarget != null) { // Only show if the target is populated.
            let appUrl = (aEvent.currentTarget as HTMLAnchorElement).href; // Get the "Application" url from the clicked link.
            let webUrl = appUrl.replace(facebookDeep, facebookSecure); // Replace the "Application" protocol with the "Web" secure protocol.
            $('#jitsi-app').attr('href', appUrl); // Update the Application link in the overlay.
            $('#jitsi-web').attr('href', webUrl); // Update the Web link in the overlay.

            overlays.open_overlay({
                name: "jitsi-overlay",
                $overlay: $("#jitsi-overlay"),
                on_close() {
                    
                },
            });
        }
    });

    const rendered_jitsi_overlay = render_jitsi_overlay({});
    $("#jitsi-overlay-modal-container").append(rendered_jitsi_overlay);
}
