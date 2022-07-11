# Copyright (c) 2022, alosada and contributors
# For license information, please see license.txt

import frappe
# from frappe.model.document import Document
from frappe.website.website_generator import WebsiteGenerator
from frappe import _

class GymMember(WebsiteGenerator):

	def get_context(self, context):
		context.gym_member = frappe.get_list("Gym Member", fields=["first_name", "last_name"])
		context.parents = [{'route':'customers','title':_('All Customers')}]

	def before_save(self):
		self.full_name = f'{self.first_name} {self.last_name or ""}'

		if self.date_of_birth:
			self.age = frappe.utils.date_diff(frappe.utils.today(),self.date_of_birth)/365

