# Copyright (c) 2022, alosada and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.model.docstatus import DocStatus

class GymWorkoutPlanSubscription(Document):
	def before_submit(self):
		if self.action == "Subscribe":
			gym_workout_plan = frappe.get_doc("Gym Workout Plan",self.gym_workout_plan)
			gym_workout_plan.subscription_status = "Subscribed"
			gym_workout_plan.save()
		elif self.action == "Unsubscribe":
			gym_workout_plan = frappe.get_doc("Gym Workout Plan",self.gym_workout_plan)
			gym_workout_plan.subscription_status = "Unsubscribed"
			gym_workout_plan.save()
		self.validate_membership()

	def before_save(self):
		if self.to_date:
			self.days_left = frappe.utils.date_diff(self.to_date,frappe.utils.today())

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
