# Copyright (c) 2022, alosada and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.model.docstatus import DocStatus

class GymLockerBooking(Document):
	def before_submit(self):
		if self.type == "Release":
			self.validate_releasing()
			gym_locker = frappe.get_doc("Gym Locker",self.gym_locker)
			gym_locker.status = "Available"
			gym_locker.save()
		elif self.type == "Book":
			self.validate_booking()
			gym_locker = frappe.get_doc("Gym Locker",self.gym_locker)
			gym_locker.status = "Not available"
			gym_locker.save()

	def validate(self):
		self.validate_membership()

	def validate_booking(self):
		self.validate_membership()
		gym_locker = frappe.get_doc("Gym Locker",self.gym_locker)
		if gym_locker.status == "Not available":
			frappe.throw("This locker is already booked. Please select another one")	

	def validate_releasing(self):
		gym_locker = frappe.get_doc("Gym Locker",self.gym_locker)
		if gym_locker.status == "Available":
			frappe.throw("Book a locker before releasing it")	

	def validate_membership(self):
		valid_membership = frappe.db.exists(
		   "Gym Membership",
			{
				"gym_member": self.gym_member,
				"docstatus": DocStatus.submitted(),
				"to_date": (">", self.date),
			},
		)
		if not valid_membership:
			frappe.throw("Please check customer's membership")	
