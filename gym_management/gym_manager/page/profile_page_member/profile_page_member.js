frappe.pages['profile-page-member'].on_page_load = function(wrapper) {
	frappe.require('profile_page_member.bundle.js', () => {
		let user_profile = new frappe.ui.ProfilePageMember(wrapper);
		user_profile.show();
	});

	// frappe.require(['profile_page_member.bundle.js', 'profile_page_member.bundle.css'], () => {
		
	// })
}