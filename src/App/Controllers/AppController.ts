import {
    bindState,
    cLeading,
    cTop,
    ForEach,
    HStack,
    Icon,
    ScrollView,
    Spacer,
    State,
    Text,
    TextAlignment,
    TextField,
    TForm,
    UIButton,
    UIController,
    UIScene,
    VStack,
} from '@tuval/forms';

interface ToDo {
    text: string;
    isComplete: boolean;
}

export class AppController extends UIController {

    @State()
    private menu_text: string;

    @State()
    private toDoList: ToDo[] = [];

    @State()
    private todo: ToDo = {
        text: "",
        isComplete: false
    }

    protected BindRouterParams() {
        const todos = localStorage.getItem("todos");
        if (!todos) {
            localStorage.setItem("todos", JSON.stringify([]));
        } else {
            this.toDoList = JSON.parse(localStorage.getItem("todos"));
        }
    }

    protected InitController() {
        this.menu_text = "About";
    }

    public OnBindModel(form: TForm) { }

    private getLocalStorage() {
        this.toDoList = []
        this.toDoList = JSON.parse(localStorage.getItem("todos"))
    }

    private setItemToLocalStorage() {
        this.toDoList.push(this.todo);
        localStorage.setItem("todos", JSON.stringify(this.toDoList));
        this.todo.text = "";
        this.getLocalStorage()
    }

    private deleteItemToLocalStorage(index: number) {
        this.toDoList.splice(index, 1)
        localStorage.setItem("todos", JSON.stringify(this.toDoList));
        this.getLocalStorage()
    }

    private isCompleteToDoItem(index: number) {
        this.toDoList[index].isComplete = !this.toDoList[index].isComplete;
        localStorage.setItem("todos", JSON.stringify(this.toDoList));
        this.getLocalStorage()
    }

    private editedItemToLocalStorage() {
        localStorage.setItem("todos", JSON.stringify(this.toDoList));
        this.getLocalStorage()
    }

    public LoadView() {

        const [selectedIndex, setSelectedIndex] = bindState(-1)

        return UIScene(
            VStack({ alignment: cTop, spacing: 20 })(
                Text("Yapılacaklar Listesi").fontSize(30).fontWeight("lighter"),
                HStack(
                    TextField()
                        .placeholder("Not Ekleyin")
                        .value(this.todo.text)
                        .onTextChange((value) => (this.todo.text = value)),
                    UIButton(
                        Text("Kaydet")
                            .foregroundColor({ hover: "#332D2D" })
                    ).onClick(() => {
                        this.setItemToLocalStorage()
                    })
                )
                    .padding("10px 20px")
                    .cornerRadius(10)
                    .background("white")
                    .width(400)
                    .height(50),
                ScrollView({ axes: "cVertical" })(
                    VStack({ alignment: cTop, spacing: 10 })(
                        ...ForEach(this.toDoList)((item, index) =>
                            HStack(
                                selectedIndex == index ?
                                    HStack(
                                        TextField().value(item.text)
                                            .onTextChange((value) => this.toDoList[index].text = value)
                                            .backgroundColor("rgba(255,255,255,0.01)")
                                            .marginLeft("10px")
                                            .padding("5px 10px"),
                                        UIButton(Text("Düzenle"))
                                            .padding("10px 10px")
                                            .cornerRadius(5)
                                            .background({ default: "white", hover: "#14A44D" })
                                            .foregroundColor({ hover: "#FBFBFB" })
                                            .transition("all .2s")
                                            .fontWeight("600")
                                            .onClick(() => {
                                                setSelectedIndex(-1)
                                                this.editedItemToLocalStorage()
                                            })
                                    ).width(700).height().padding("5px 0").borderBottom("2px solid lightgray")
                                    :
                                    HStack({ alignment: cLeading, spacing: 10 })(
                                        this.toDoList[index].isComplete == true ?
                                            HStack(
                                                Icon("\\e837").cursor("pointer").onClick(() => {
                                                    this.isCompleteToDoItem(index)
                                                }),
                                                Text(item.text).padding("5px 10px")
                                                    .fontWeight("600").multilineTextAlignment(TextAlignment.leading),
                                                Icon("\\e877")
                                            ).width().foregroundColor("#14A44D")
                                            :
                                            HStack(
                                                Icon("\\e836").cursor("pointer").onClick(() => {
                                                    this.isCompleteToDoItem(index)
                                                }),
                                                Text(item.text).padding("5px 10px")
                                                    .fontWeight("600").multilineTextAlignment(TextAlignment.leading)
                                            ).width().foregroundColor("#3B71CA"),
                                        Spacer(),
                                        UIButton(Text("Düzenle"))
                                            .padding("10px 10px")
                                            .cornerRadius(5)
                                            .background({ default: "white", hover: "#54B4D3" })
                                            .foregroundColor({ hover: "#FBFBFB" })
                                            .transition("all .2s")
                                            .fontWeight("600")
                                            .onClick(() => {
                                                setSelectedIndex(index)
                                            }),
                                        UIButton(
                                            Text("Sil")
                                        ).onClick(() => this.deleteItemToLocalStorage(index))
                                            .padding("10px 20px")
                                            .cornerRadius(5)
                                            .background({ default: "white", hover: "#DC4C64" })
                                            .foregroundColor({ hover: "#FBFBFB" })
                                            .transition("all .2s")
                                            .fontWeight("600")
                                    ).width(700).height().padding("5px 0").borderBottom("2px solid lightgray")
                            ).width().height(),
                        )
                    )
                ).width(850)
            ).padding(50)
        )
    }
}