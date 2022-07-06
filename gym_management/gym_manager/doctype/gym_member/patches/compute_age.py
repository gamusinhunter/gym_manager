# Copyright (c) 2022, alosada and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe

def execute():
    for gym_member in frappe.db.get_all('Gym Member', pluck='name'):
        doc = frappe.get_doc('Gym Member',gym_member)
        doc.compute_age()
        doc.save()