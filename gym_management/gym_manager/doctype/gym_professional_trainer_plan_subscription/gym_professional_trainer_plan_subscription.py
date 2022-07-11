# Copyright (c) 2022, alosada and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.model.docstatus import DocStatus

class GymProfessionalTrainerPlanSubscription(Document):
	
		def before_submit(self):
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
