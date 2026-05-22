// 예약어, 타입 지정자
// +,-,*,/ -> 연산자
// =, +=, -=, *=, /= -> 대입 연산자

// console.dir()

class tools {

    static test(url, method) {
        return new Promise((resolve, reject) => {
            const req = new XMLHttpRequest();

            req.open(method, url);

            req.addEventListener("readystatechange", e => {
                
                if(req.readyState == XMLHttpRequest.DONE) {

                    let value = req.responseText;
                    if(req.status == 200) resolve(value);
                    else reject(value);     


                }

            })

            req.send()
        })
        
    }
}

class System {

    date = new Date();

    todolist = document.querySelector(".list");
    dateInput = document.querySelector("#todo-date");
    nameInput = document.querySelector("#todo-name");
    timeInput = document.querySelector("#todo-time");

    /** @param {Date} InnerDate */
    formateDate(InnerDate) {
        return `${InnerDate.getFullYear()}-${String(InnerDate.getMonth()+1).padStart(2, '0')}-${String(InnerDate.getDate()).padStart(2, '0')}`;
    }

    // YYYY-MM-DD
    // HH:MM:SS

    /** @param {Date} InnerDate */
    formateTime(InnerDate) {
        return `${String(InnerDate.getHours()).padStart(2, '0')}:${String(InnerDate.getMinutes()).padStart(2, '0')}:${String(InnerDate.getSeconds()).padStart(2, '0')}`;
    }

    setup() {
        const today = new Date().toISOString().split('T')[0];

        const dateInput = document.querySelector("#todo-date");

        dateInput.value = today;
        dateInput.setAttribute("min", today);
    }

    event() {
        const saveBtn = document.querySelector("#saveBtn");
        saveBtn.addEventListener("click", (event) => {
            event.preventDefault();

            let inputDateTime = new Date(`${this.dateInput.value} ${this.timeInput.value}`);

            this.date.setSeconds(0);
            this.date.setMilliseconds(0);

            if (inputDateTime < this.date) {
                alert("이미 지난 날짜와 시간은 입력할 수 없어요우");
                return;
            }

            let saveTime = `${this.formateDate(this.date)} ${this.formateTime(this.date)}`;
            
            this.todolist.innerHTML += `
                <div class="item">
                    <div>
                        <p>${this.nameInput.value}</p>
                        <p>${this.dateInput.value} ${this.timeInput.value}</p>
                        <p>저장: ${saveTime}</p>
                    </div>

                    <div>
                        <button class="edit">수정</button>
                        <button class="delete">삭제</button>
                    </div>
                </div>
            `;

        }); 
    }

}

// window.addEventListener("DOMContentLoaded", () => {

//     const loginOpenBtn = document.getElementById("loginOpenBtn");
//     const loginModal = document.getElementById("loginModal");
//     const loginBtn = document.getElementById("loginBtn");
//     const loginMessage = document.getElementById("loginMessage");

//     loginOpenBtn.addEventListener("click", () => {
//         loginModal.style.display = "block";
//     });

//     loginBtn.addEventListener("click", () => {
//         console.log("로그인 버튼 클릭됨");

//         const name = document.getElementById("login-name").value;
//         const password = document.getElementById("login-password").value;

//         tools.test("./src/datas/users.json", "GET")
//             .then(res => {
//                 const data = JSON.parse(res);
//                 const users = data.users;

//                 let isLogin = false;

//                 users.forEach(user => {
//                     if (user.name === name && user.password == password) {
//                         isLogin = true;
//                     }
//                 });

//                 if (isLogin) {
//                     loginMessage.textContent = "로그인 성공!";

//                     setTimeout(() => {
//                         loginModal.style.display = "none";
//                     }, 1000);

//                 } else {
//                     loginMessage.textContent = "로그인 실패!";
//                 }
//             })
//             .catch(err => {
//                 console.error(err);
//             });

//     });

// });

class Chart {
    constructor() {
        this.canvas = document.querySelector("canvas");
        this.ctx = null;
        this.padding = 75; // 여백

        this.datas = null;

        this.canvasInit();
        this.setChart();
        this.drawChart();
    }

    canvasInit() {
        if(this.canvas.getContext) {
            this.canvas.width = 500;
            this.canvas.height = 500;
            this.ctx = this.canvas.getContext("2d");
        }
    }

    changeRad(deg) {

        // PI / 180 라디안 = 1도
        // PI = 180

        return (Math.PI / 180) * deg;
    }

    setChart() {
        this.ctx.beginPath();
        this.ctx.moveTo(this.padding, this.padding);
        this.ctx.lineTo(this.padding, this.canvas.height - this.padding);
        this.ctx.lineTo(this.canvas.width - this.padding, this.canvas.height - this.padding);
        this.ctx.stroke();
    }

    async drawChart() {
        
        this.datas = await fetch("./src/datas/datas.json").then(res => res.json());

        let res = [...this.datas.datas].reduce((a, dateList) => {
            const date = new Date(dateList.date);
            let month = date.getMonth() + 1;
            let findata = a.find(data => data.month == month);

            if(findata){

                a = a.map((data) => {

                    if(data.month == month) {
                            
                        return {...data, todo: [...data.todo, ...dateList.todo]};
                    }

                       return data;

                })

            } else {

                  a.push({
                    "month" : month,
                    "todo" : dateList.todo
                })

            }

            return a;
        
        }, []);
        res = res.map(data => {
            return {...data, todo: data.todo.filter(todoData => todoData.complate)}; // (todoData) => {return todoData.complate;}

        })

        // 0~5
        let max = [...res].reduce((a, data) => {
            if(data.todo.length > a) a = data.todo.length;
            return a;
        }, 0);

        //요소들의 총 수: 6
        // a : 75(여백)
        // b : this.canvas.height - thhis.padding
        let add = ((this.canvas.height - this.padding) - this.padding) / ((max+2) - 1);
        for(let i = 0; i <= max + 1; i++) {
            this.ctx.font = '16px serif';
            let text = this.ctx.measureText(i);
            this.ctx.fillText(i, this.padding - text.width - 5, (this.canvas.height - this.padding) - (add * i) + (12 / 2));
        } 

        add = ((this.canvas.width - this.padding) - this.padding) / (res.length + 1);

       for(let i = 0; i < res.length; i++) {
            this.ctx.font = '16px serif';
            let text = this.ctx.measureText(res[i].month);
            this.ctx.fillText(res[i].month, this.padding + (add * (i + 1)) - (text.width / 2), this.canvas.height - this.padding + 16);
        }

        let barsize = 20;
        for(let i = 0; i < res.length; i++) {
            let a = 0;
            let b = 5;
            let c = this.padding;
            let d = this.canvas.height - this.padding;

            let height = c + ( ( (res[i].todo.length - 1) / (b - a) ) * (d - c) );
            this.ctx.fillRect(this.padding + (add * (i + 1)) - (barsize / 2), this.canvas.height - this.padding, barsize, -1 * height);
        }

        this.drawStick(res);
    }

    drawStick(frame, data) {
        
        requestAnimationFrame(() => this.drawStick(++frame, res))
    }
}