# To-Do Manager Project 📝🚀

---

## Overview

Welcome to the To-Do Manager Project, a versatile and intuitive solution for managing your daily tasks. Leveraging the capabilities of Salesforce Lightning Web Components (LWC), this project offers a seamless and visually appealing way to organize your to-do list.

## Key Achievements

### `todoHeader` Component ⏰

- Displays the current time with a dynamic greeting based on the time of day.
- Integrates an external JavaScript module to fetch and display a random quote for daily inspiration.
- Features a `lightning-record-edit-form` for creating new To-Do Task records effortlessly.

![todoHeader Component](https://github.com/khushal-ganani/todo-list/assets/152521234/9f721328-1220-4077-a636-fe0e8b6980a7)

### `todoCard` Component 🗂️

- Presents To-Do tasks in a visually appealing card format.
- Utilizes Salesforce styling (SLDS) and its features like `Design Tokens` and `Styling Hooks`. It also uses custom CSS for an elegant design.
- Implements dynamic `lightning-icons` and `lightning-badges` based on To-Do task priorities and types field values.

### `filterTodo` Component 🔍

- Enables dynamic filtering of To-Do tasks in which Users can filter To-Do's on the `todoCardList` component based on various criteria such as Name, Priority, Type, and Sorting options.
- Leverages Lightning Message Service (LMS) for efficient communication between `filterTodo` and `todoCardList` components.

### 4. Responsive `todoCardList` Component 📋

- Displays To-Do tasks as cards using the child `todoCard` component.
- Utilizes an Apex controller to fetch data dynamically based on filters, page size, and page number.
- Ensures responsiveness across various devices using `@flexipageRegionWidth` property and `@salesforce/client/formFactor` module.

![todoFilter & todoCardList Components](https://github.com/khushal-ganani/todo-list/assets/152521234/dc034505-95c1-49bb-83c1-1f7bd258c013)

### 5. `paginator` Component 📄

- Integrates as a child component in `todoCardList` for easy navigation between pages.
- Allows users to change the page number according to their preferences.

### 6. Apex Controller Expertise

- The `TodoController` Apex class showcases operations on the server-side development.
- Implements a wrapper class (`TodoCardListData`) to structure data efficiently.
- Utilizes a sub-wrapper class (`Filters`) on the `TodoController` controller class for handling dynamic filters.

### 7. Comprehensive Testing

- The Apex controllers and wrapper classes are tested using Apex test classes, achieving 100% code coverage. This reflects my dedication to delivering robust and reliable solutions.



https://github.com/khushal-ganani/todo-list/assets/152521234/58141e72-5966-421d-bebf-2520bc240fb4



## Technologies and Best Practices

- **Lightning Web Components (LWC):** Leveraged LWC framework for building modular and efficient components. Each functionality is encapsulated within its own Lightning Web Component (LWC), promoting modular and reusable code.
- **Lightning Message Service (LMS):** Implemented LMS for seamless communication between components, showcasing my understanding of advanced Salesforce features.
- **Responsive Design:** Ensured a responsive user interface using properties like `@flexipageRegionWidth` and the `@salesforce/client/formFactor` module.
- **Structured Data Handling with Wrapper Classes:** Utilized a wrapper class (`TodoCardListData`) to structure data efficiently. Wrapper classes provide a clear structure to handle and transport data between server and client, improving code readability and maintenance.
- **Dynamic SOQL Query Building:** Dynamically constructed SOQL queries in the Apex controller based on filters, page size, and page number. This approach allows flexibility in querying data based on user input, promoting a scalable and adaptable solution.
- **Apex Testing:** Thoroughly tested Apex controllers and wrapper classes with 100% code coverage to guarantee the reliability of server-side logic.

## Conclusion

The To-Do Manager Project is a testament to effective task management with a blend of functionality and aesthetics. Explore the components, experience the seamless interactions, and embrace the organized world of to-do lists.

Thank you for taking the time to explore the To-Do Manager Project. For any feedbacks or discussions, please feel free to reach out.

## Contact 📬

*Connect with me on social media:*
- LinkedIn:  [`www.linkedin.com/in/your-linkedin`](www.linkedin.com/in/khushal-ganani)
- Email:     [`khushal.ganani@gmail.com`](mailto:khushal.ganani@example.com)
- Trailhead: [`Trailhead Profile`](https://www.salesforce.com/trailblazer/khushalg)
  
## Project Videos

### To-Do Project Video (Desktop) :



https://github.com/khushal-ganani/todo-list/assets/152521234/32e829c1-7559-4660-9557-4a2337cbcf17




### To-Do Project Video (Mobile) :



https://github.com/khushal-ganani/todo-list/assets/152521234/9e129b1b-973d-42e3-98ce-9c75d08e5947





## Getting Started

To set up and run the project locally, follow these steps:

1. Clone the repository by running the following command on your Terminal: 
```Git Bash
git clone https://github.com/khushal-ganani/todo-list.git
```

2. Deploy the project to your Salesforce environment using your preferred deployment tool or Salesforce CLI.
