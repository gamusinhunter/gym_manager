# Copyright (c) 2022, alosada and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.model.docstatus import DocStatus

class GymProfessionalTrainerPlanSubscriptio(Document):
	def before_submit(self):
		if self.action == "Subscribe":
			gym_professional_trainer_plan = frappe.get_doc("Gym Professional Trainer Plan",self.gym_professional_trainer_plan)
			gym_professional_trainer_plan.status = "Subscribed"
			gym_professional_trainer_plan.save()
		elif self.action == "Unsubscribe":
			gym_professional_trainer_plan = frappe.get_doc("Gym Professional Trainer Plan",self.gym_professional_trainer_plan)
			gym_professional_trainer_plan.status = "Unsubscribed"
			gym_professional_trainer_plan.save()

	def before_save(self):		
		if self.to_date:
			self.days_left = frappe.utils.date_diff(self.to_date,frappe.utils.today())

	def validate(self):
		self.validate_membership()

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