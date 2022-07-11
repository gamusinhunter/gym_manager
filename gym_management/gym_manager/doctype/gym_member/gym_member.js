// Copyright (c) 2022, alosada and contributors
// For license information, please see license.txt


frappe.ui.form.on('Gym Member', {
	refresh: function(frm) {

		frappe.call({
			method:"frappe.client.get_value",
			args: {
				doctype:"Gym Membership",
				filters: {
					gym_member: frm.doc.name
				},
				fieldname:["days_left"]
			}, 
			callback: function(r) {
				var a = r.message.days_left;
				console.log(a);
				cur_frm.set_value('remaining_days', a);
			}
		})

		frappe.call({
			method:"frappe.client.get_value",
			args: {
				doctype:"Gym Workout Plan Subscription",
				filters: [
					['gym_member','like',frm.doc.name],
					['docstatus','=',1],
					['days_left','>',0]  
				],
				fieldname:["gym_trainer"]
			}, 
			callback: function(r) {
				var a = r.message.gym_trainer;
				console.log(a);
				cur_frm.set_value('allocated_trainer', a);
			}
		})

		frappe.call({
			method:"frappe.client.get_value",
			args: {
				doctype:"Gym Trainer",
				filters: {
					trainer_name: frm.doc.allocated_trainer
				},
				fieldname:["trainer_phone"]
			}, 
			callback: function(r) {
				var a = r.message.trainer_phone;
				console.log(a);
				cur_frm.set_value('trainer_phone', a);
			}
		})

		frappe.call({
			method:"frappe.client.get_value",
			args: {
				doctype:"Gym Workout Plan Subscription",
				filters: [
					['gym_member','like',frm.doc.name],
					['docstatus','=',1],
					['days_left','>',0]  
				],
				fieldname:["gym_selected_plan"]
			}, 
			callback: function(r) {
				var a = r.message.gym_selected_plan;
				console.log(a);
				cur_frm.set_value('active_plan', a);
			}
		})

		frappe.call({
			method:"frappe.client.get_value",
			args: {
				doctype:"Gym Workout Plan Subscription",
				filters: [
					['gym_member','like',frm.doc.name],
					['docstatus','=',1],
					['days_left','<',0] 
				],
				fieldname:["gym_selected_plan"]
			}, 
			callback: function(r) {
				var a = r.message.gym_selected_plan;
				console.log(a);
				cur_frm.set_value('past_plans', a);
			}
		})

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
					},
					{
						fieldname: 'from_date',
						label: 'From date',
						fieldtype: 'Date',
					}
				],
				primary_action(values){
					frappe.db.insert({
						doctype: 'Gym Locker Booking',
						gym_member: frm.doc.name,
						gym_locker: values.gym_locker,
						from_date: values.from_date,
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
			let dialog = new frappe.ui.Dialog({
				title: 'Choose a group class',
				fields: [
					{
						fieldname: 'gym_group_class',
						label: 'Group Class',
						fieldtype: 'Link',
						options: 'Gym Group Class',
					},
					{
						fieldname: 'gym_group_class_day',
						label: 'Day',
						fieldtype: 'Date',
					},
					{
						fieldname: 'gym_group_class_spot',
						label: 'Spot',
						fieldtype: 'Select',
						options: ['17:00','18:00','19:00','20:00','21:00'],
					}
				],
				primary_action(values){
					frappe.db.insert({
						doctype: 'Gym Group Class Booking',
						gym_member: frm.doc.name,
						gym_class: values.gym_group_class,
						day: values.gym_group_class_day,
						spot: values.gym_group_class_spot,
						date: frappe.datetime.now_date(),
					}).then(doc =>{
						dialog.hide();
						frappe.set_route('Form','Gym Group Class Booking',doc.name);
					})
				}
			});
			dialog.show();
		})

		frm.add_custom_button('Subscribe Workout Plan', () => {
			let dialog = new frappe.ui.Dialog({
				title: 'Subscribe a workout plan',
				fields: [
					{
						fieldname: 'gym_workout_plan',
						label: 'Workout Plan',
						fieldtype: 'Link',
						options: 'Gym Workout Plan',
					}
				],
				primary_action(values){
					frappe.db.insert({
						doctype: 'Gym Workout Plan Subscription',
						gym_member: frm.doc.name,
						gym_workout_plan: values.gym_workout_plan,
						action: 'Subscribe',
						date: frappe.datetime.now_date(),
					}).then(doc =>{
						dialog.hide();
						frappe.set_route('Form','Gym Workout Plan Subscription',doc.name);
					})
				}
			});
			dialog.show();
		})

		frm.add_custom_button('Subscribe Professional Trainer Plan', () => {
			let dialog = new frappe.ui.Dialog({
				title: 'Subscribe a professional trainer plan',
				fields: [
					{
						fieldname: 'gym_professional_trainer_plan',
						label: 'Professional Workout Plan',
						fieldtype: 'Link',
						options: 'Gym Professional Trainer Plan',
					},
					{
						fieldname: 'gym_professional_trainer_plan_from_date',
						label: 'From date',
						fieldtype: 'Date'
					},
					{
						fieldname: 'gym_professional_trainer_plan_to_date',
						label: 'To date',
						fieldtype: 'Date'
					}
				],
				primary_action(values){
					frappe.db.insert({
						doctype: 'Gym Professional Trainer Plan Subscription',
						gym_member: frm.doc.name,
						gym_professional_trainer_plan: values.gym_professional_trainer_plan,
						from_date: values.gym_professional_trainer_plan_from_date,
						to_date: values.gym_professional_trainer_plan_to_date,
						action: 'Subscribe',
						date: frappe.datetime.now_date(),
					}).then(doc =>{
						dialog.hide();
						frappe.set_route('Form','Gym Professional Trainer Plan Subscription',doc.name);
					})
				}
			});
			dialog.show();		
		})
	}
});
