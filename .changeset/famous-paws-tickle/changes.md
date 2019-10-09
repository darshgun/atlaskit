ED-7799 Refactor analytics to prevent splitting history

* Use analytics step direct into the same transaction instead of setting on meta and appending a different transaction afterwards.
* Add current selection position into analytics step to create step map base on current position. This makes that all of the following steps can be appended. 
