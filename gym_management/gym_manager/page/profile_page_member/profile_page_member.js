frappe.pages['profile-page-member'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Profile Page',
		single_column: true
	});
}