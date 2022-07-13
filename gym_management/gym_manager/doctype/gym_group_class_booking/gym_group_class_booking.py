# Copyright (c) 2022, alosada and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.model.docstatus import DocStatus

class GymGroupClassBooking(Document):

	def validate(self):
		self.validate_maximum_limit()

	def validate_maximum_limit(self):
		max_classes = frappe.db.get_single_value("Gym Settings", "maximum_number_of_booked_classes")
		count = frappe.db.count(
			"Gym Group Class Booking",
			{"gym_member": self.gym_member, "docstatus": DocStatus.submitted()},
		)
		if count >= max_classes:
			frappe.throw("Maximum limit reached for booking classes")

	def before_submit(self):
		self.validate_membership()

	def validate_membership(self):
		valid_membership = frappe.db.exists(
		"Gym Membership",
			{
				"gym_member": self.gym_member,
				"docstatus": DocStatus.submitted()
			},
		)
		if not valid_membership:
			frappe.throw("Please check customer's membership")

