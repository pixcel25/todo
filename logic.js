//  function to create a task and append it to the list (takes title & id of task as parameter)
function createTask(name)
{
     // create div task and assign class and status
    const mainDiv = document.createElement('div');
    mainDiv.className = 'task';
   




      // dataset.status stored as string
    mainDiv.dataset.status = name.status ? 'true' : 'false';
    mainDiv.id = name.id;

    
    // assigning title and appending to the task
    const title = document.createElement('input');
    title.maxLength= 20;
    
    title.value = name.title.toUpperCase();
    title.readOnly = true;
    mainDiv.appendChild(title);

    // Set line-through based on status
    if (name.status === true || name.status === 'true') {
        title.style.textDecoration = 'line-through';
    } else {
        title.style.textDecoration = 'none';
    }












    // assigning unique id
    mainDiv.id =  name.id;

    // div to store btns
    const btnDiv = document.createElement('div');

    // create btn and append it to btnDiv
    // edit btn
    let button = document.createElement('button');
    button.innerText = "✏️";
    button.id = "edit";
    button.onclick = ()=>editTitle(mainDiv.id);
    btnDiv.appendChild(button);

    // complete btn
    button = document.createElement('button');
    button.innerText = "✔️";
    button.id = "complete";
    button.onclick = ()=>taskStatus(mainDiv.id);
    btnDiv.appendChild(button);

    // delete btn
    button = document.createElement('button');
    button.innerText = "🗑️";
    button.id = "delete";
    button.onclick = ()=>deleteTask(mainDiv.id);
    btnDiv.appendChild(button);
    


    // appending btnDiv to task div
    mainDiv.appendChild(btnDiv);





    // adding task to the list
    const list = document.querySelector('.list');
    list.appendChild(mainDiv);

 
 

};

    
async function getTasks() {
  try {
    const response = await fetch("http://127.0.0.1:8000/task-list/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    load(data);




  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};

getTasks();

// loads existing task from the database
function load(data)
{

    const list = document.querySelector('.list');
    list.innerHTML = ""; // clear existing tasks
    for (let i = 0; i < data.length; i++) {
        createTask(data[i]);
    
}

};

// intialise add btn and add event listner
// function adds new task to database
const addBtn = document.getElementById('addbtn');
addBtn.addEventListener('click',async(e)=>{

  e.preventDefault();
// take input and clean input bar

let task = document.getElementById('newTask');
let title = task.value;
task.value = "";

// sent post request with the title

// fetch request
await fetch('http://127.0.0.1:8000/task-create/',
 
  {
//  defining method
    method: "POST",
//  adding additional context (mandatory)
    headers: {
                "Content-Type": "application/json"
             },
//  data first being converted to JSON and then being sent in the body
    body: JSON.stringify({
             
             "title": title,
              "status": false
          })

  }
);


// load the list again

getTasks();





});


//to delete task from database
// intialise button and add eventListener

async function deleteTask(id)
{
  await fetch(`http://127.0.0.1:8000/task-delete/${id}/`,
    {
      method: 'DELETE',
      headers: {  "Content-Type": "application/json"}
    }
  )
  getTasks();
};


  // function to update task
async function updateTask(id)
{

// const response =  await fetch(`http://127.0.0.1:8000/task-update/${id}/`,
//     {
//       method: 'POST',
//       headers: {  "Content-Type": "application/json"},
//       body:{  'status':true }
//     }
//   );

//   getTasks();
}




  async function taskStatus(id) {
  const task = document.getElementById(id);
  const span = task.querySelector('input');

  // toggle status
  const newStatus = task.dataset.status === 'false';
  task.dataset.status = newStatus ? 'true' : 'false';
  span.style.textDecoration = newStatus ? 'line-through' : 'none';

  // update backend
  await fetch(`http://127.0.0.1:8000/task-update/${id}/`, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      'title': span.value,
      'status': newStatus })
  });
};





function editTitle(id) {
  task = document.getElementById(id);
  let title = task.querySelector('input');

  if (title.readOnly === true) {
    title.readOnly = false;
    title.maxLength = 12;
    title.addEventListener('keydown', async (e) => {  // ✅ locks on Enter
  if (e.key === 'Enter') {
    title.readOnly = true;
    fetch(`http://127.0.0.1:8000/task-update/${id}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "title": title.value })
    });
  }
});
  }
  else{
    title.readOnly = true;
  }
}