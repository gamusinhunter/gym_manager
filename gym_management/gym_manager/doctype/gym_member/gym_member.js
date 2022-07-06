// Copyright (c) 2022, alosada and contributors
// For license information, please see license.txt


frappe.ui.form.on('Gym Member', {
	refresh: function(frm) {
		frm.add_custom_button('Create Membership', () => {
			frappe.new_doc('Gym Membership', {
				gym_member: frm.doc.name
			})
		})

		frm.add_custom_button('Book Locker', () => {
			let dialog = new frappe.ui.Dialog({
				title: 'Book a locker',
				fields: [
					{
						fieldname: 'gym_locker',
						label: 'Locker',
						fieldtype: 'Link',
						options: 'Gym Locker',
					}
				],
				primary_action(values){
					frappe.db.insert({
						doctype: 'Gym Locker Booking',
						gym_member: frm.doc.name,
						gym_locker: values.gym_locker,
						type: 'Book',
						date: frappe.datetime.now_date(),
					}).then(doc =>{
						dialog.hide();
						frappe.set_route('Form','Gym Locker Booking',doc.name);
					})
				}
			});
			dialog.show();
		})

		frm.add_custom_button('Book Group class', () => {
			
		})
		frm.add_custom_button('Subscribe Workout Plan', () => {
			
		})
		frm.add_custom_button('Subscribe Professional Trainer Plan', () => {
			
		})
	}
});
