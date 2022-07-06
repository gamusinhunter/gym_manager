# Copyright (c) 2022, alosada and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.model.docstatus import DocStatus

class GymWorkoutPlanSubscription(Document):
	def before_submit(self):
		if self.action == "Subscribe":
			gym_workout_plan = frappe.get_doc("Gym Workout Plan",self.gym_workout_plan)
			gym_workout_plan.status = "Subscribed"
			gym_workout_plan.save()
		elif self.action == "Unsubscribe":
			gym_workout_plan = frappe.get_doc("Gym Workout Plan",self.gym_workout_plan)
			gym_workout_plan.status = "Unsubscribed"
			gym_workout_plan.save()

	def validate(self):
		self.validate_membership()

	# def validate_booking(self):
	# 	self.validate_membership()
	# 	gym_locker = frappe.get_doc("Gym Locker",self.gym_locker)
	# 	if gym_locker.status == "Not available":
	# 		frappe.throw("This locker is already booked. Please select another one")	

	# def validate_releasing(self):
	# 	gym_locker = frappe.get_doc("Gym Locker",self.gym_locker)
	# 	if gym_locker.status == "Available":
	# 		frappe.throw("Book a locker before releasing it")	

	def validate_membership(self):
		valid_membership = frappe.db.exists(
		   "Gym Membership",
			{
				"gym_member": self.gym_member,
				"docstatus": DocStatus.submitted(),
				"to_date": (">", self.to_date),
			},
		)
		if not valid_membership:
			frappe.throw("Please check customer's membership")
