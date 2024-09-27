### tl;dr: ineffective management of a substantial amount of data.

### Problem Overview

BC Cancer faces several challenges related to managing donor data and sending invitations for fundraising events. Their current process relies heavily on manual work using spreadsheets, which leads to inefficiencies and data integrity issues.

### Key Pain Points:

1. **Manual Data Handling**: Event coordinators at BC Cancer use large spreadsheets to organize donor information, manually filtering donors by attributes such as region, type of cancer interest, and event participation history. This process is slow, prone to errors, and difficult to scale. In addition, using Excel for large data sets is slow and troublesome. There are issues with version control, data mismatches, and backups being created through copy-pasting.
2. **Duplicate Invitations**: While BC Cancer intentionally sends invitations to both individuals in a couple, they also send multiple invitations to the same couple through their associated businesses or ventures. This redundancy complicates communication efforts. All donor data is pulled from Raiser’s Edge into Excel, which makes managing and avoiding duplicates difficult.
3. **Invitation Process**: The process of sending invitations to donors is manual. Coordinators pull contact information from spreadsheets and input them into email or postal systems. There is no automated system to streamline this process or prevent unnecessary duplicate invites. Also, it is difficult to select appropriate donors for events and sending the right kind of invitations.
4. **Tracking and Feedback**: Once invitations are sent, there is no efficient mechanism to track who has received, opened, or responded to the invitations. The absence of feedback loops makes it challenging to monitor engagement and send timely reminders.
5. **Scalability Issues**: As BC Cancer’s donor base grows, the current spreadsheet-based system struggles to manage the increasing volume of data. This results in slower event coordination, an increased risk of missing key donor segments, and difficulty in searching and navigating through the Excel sheets.

### Impact on BC Cancer

These inefficiencies slow down event coordination, reduce communication accuracy, and increase the workload for BC Cancer staff. The reliance on manual processes and spreadsheets hampers their ability to engage donors effectively, leading to potential missed opportunities for event attendance and fundraising.

---

### Questions for clarification
1. In terms of a better data management tool, what kind of user persona do BC Cancer assume? E.g., fundraisers? coordinators? or supervisors?
2. If the new data management tool is going to integrate donors' individual donating history, how would BC Cancer like to approach that?
3. In terms of related accounts deduplication, in what way are accounts considered as *related*?
4. When deciding a list of donors, what specific filter criteria does BC Cancer have?
1. What specific data do you need to store about each donor (e.g., name, address, preferences, history of interactions)?
2. How frequently is the donor data updated? 
3. In what kind of cases, will you think of a donor as inactive? and how you want us to deal with inactive donators (delete or keep track of them for a while)?
4. Do you have a way of categorizing your events? If so, how are they categorized?
5. How do you currently segment donors for different events and communications?
6. What criteria do you use to decide which donors receive specific invitations?
7. Do you have a defined process for managing donor email preferences and unsubscribes?
8. (Data Collaboration Problems) What is the maximum number of people who can currently access and modify a shared Excel document at the same time?
9. If we were to set up a donators data management system, would you like us to include permission management? What roles and permissions do we need to consider?
1. What exactly happens each time a review list is pulled from Raiser’s Edge? For example, will the “review list” include new names each time it gets updated from CRM?
2. What are the information not included in the review list but are useful for future references?
3. How is the history record of a donor stored?
4. How are history records stored for each donor?