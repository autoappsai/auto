export const SOCIALL_API_SERVER_URL = 'https://sociallapi.autoapps.ai';
//export const SOCIALL_API_SERVER_URL = 'http://localhost:3000';
export const AI_API_SERVER_URL =
	'https://auto-social-ai-s6zz7icxea-uc.a.run.app/generate_post';

export const FACEBOOK_APP_ID = '2028567190857635';
export const FACEBOOK_REDIRECT_URL = 'https://sociallapi.autoapps.ai/oauth';
export const FACEBOOK_SCOPE =
	'instagram_basic,instagram_content_publish,instagram_manage_comments,instagram_manage_insights,pages_show_list,pages_read_engagement,page_events,pages_manage_cta,business_management';
//export const FACEBOOK_SCOPE = 'instagram_basic,instagram_content_publish';
export const FACEBOOK_DIALOG_URL = `https://www.facebook.com/v16.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&display=popup&redirect_uri=${FACEBOOK_REDIRECT_URL}&response_type=token&scope=${FACEBOOK_SCOPE}`;
