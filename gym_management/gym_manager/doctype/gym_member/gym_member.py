# Copyright (c) 2022, alosada and contributors
# For license information, please see license.txt

import frappe
from frappe.website.website_generator import WebsiteGenerator

class GymMember(Document):

	def before_save(self):
		self.full_name = f'{self.first_name} {self.last_name or ""}'

		if self.date_of_birth:
			self.age = frappe.utils.date_diff(frappe.utils.today(),self.date_of_birth)/365

