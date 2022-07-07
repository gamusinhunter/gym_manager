# Copyright (c) 2022, alosada and contributors
# For license information, please see license.txt

from genericpath import exists
import frappe
from frappe.model.document import Document
from frappe.model.docstatus import DocStatus

class GymMembership(Document):
	def before_submit(self):
		exists = frappe.db.exists(
		   "Gym Memberbership",
			{
				"gym_member": self.gym_member,
				"docstatus": DocStatus.submitted(),
				"from_date": ("<", self.from_date),
				"to_date": (">", self.to_date),
			},
		)
		if exists:
			frappe.throw("There is already an active membership")

		if self.to_date:
			self.days_left = frappe.utils.date_diff(self.to_date,frappe.utils.today())