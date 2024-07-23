import $ from "jquery";
import {page_params} from "./page_params";

export const zoom_token_callbacks = new Map();
export const video_call_xhrs = new Map();

export function get_jitsi_server_url(): string | null {
    let appToken = ""; // Default value of app token is blank.

    $.ajax({
        url: 'accounts/login/generatejwt/',   // Generate JWT URL.
        method: 'GET',                        // GET type of request.
        dataType: 'json',                     // Expecting JSON response
        async: false,                         // Make the request synchronous
        context: appToken,                    // Make the appToken the "this" so we can access it in the success callback.
        success: function(aValue: any) {
            if (aValue.result === "success") appToken = "&jwt=" + aValue.token; // If the request was successful, get token from the json response and prepare it for appending to url.
        },
        error: function(aJqXHR: XMLHttpRequest, aTextStatus: any, aErrorThrown: any) {
            console.error('Error:', aJqXHR.status, aTextStatus, aErrorThrown); // Log the error.
            throw aErrorThrown;  // Rethrow the error to be handled by the caller
        }
    });

    return (page_params.realm_jitsi_server_url ?? page_params.server_jitsi_server_url) + appToken; // Using the "Application" url from the clicked link, add on jwt token.
}

export function abort_video_callbacks(edit_message_id = ""): void {
    zoom_token_callbacks.delete(edit_message_id);
    if (video_call_xhrs.has(edit_message_id)) {
        video_call_xhrs.get(edit_message_id).abort();
        video_call_xhrs.delete(edit_message_id);
    }
}

export function compute_show_video_chat_button(): boolean {
    const available_providers = page_params.realm_available_video_chat_providers;
    if (page_params.realm_video_chat_provider === available_providers.disabled.id) {
        return false;
    }

    if (
        page_params.realm_video_chat_provider === available_providers.jitsi_meet.id &&
        !get_jitsi_server_url()
    ) {
        return false;
    }

    return true;
}

export function compute_show_audio_chat_button(): boolean {
    const available_providers = page_params.realm_available_video_chat_providers;
    if (
        (available_providers.jitsi_meet &&
            get_jitsi_server_url() &&
            page_params.realm_video_chat_provider === available_providers.jitsi_meet.id) ||
        (available_providers.zoom &&
            page_params.realm_video_chat_provider === available_providers.zoom.id)
    ) {
        return true;
    }
    return false;
}
