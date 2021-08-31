//consts
const registerDisplayClass = ".registerOutput";
const registerNameClass = ".registerName";
const stackDisplayClass = ".stackDisplay";
const emptyRegisterMessage = "(empty) ----";
const emptyHexNumber = "----";
const emptyStackMessage = "(empty) push blue(from) value";
const heksaDecimalNumbers = /[0-9A-Fa-f]/;
const defaultRegisterValue = "0000";
const memoryLimit = 65536;
const selectBothMessage = " You didn't select registers";
const selectAnyMessage = " You didn't select any registers";
const selectSingleMessage = "You didn't select blue(from) register";
const inputsSelectMessage = "You didn't choose data flow direction";
const defaultMessage = "Something is not quite right";
const indexMessage = "You didn't select memory index";
const exchUndefindedMessage = "Selected momory is empty, exchange action impossible";
const moveUndefindedMessage = "Selected momory is empty, you cannot move empty data to memory";
const emptyMemoryMessage = "Cannot withdraw data from memory";
const stackLimitMessage = "You reached stack limit. You cannot push further";
const stackEmptyMessage = "Stack is empty you cannot withdraw data";

function registerCompleteMessage(which){
    return "Register " + which + " edited";
}
function registerErrorMessage(which){
    return "Register " + which + " was not edited. Please use maximum 4 heksadecimal numbers";
}
function clearMessage(which){
    return "Register " + which + " cleared.";
}
function randomizedMessage(which){
    return "Register " + which + " randomized.";
}
function errorMessageAlert(html){
    let span = document.createElement('span');
    span.innerHTML = html;
    $(span).css('display', 'none');
    $(span).appendTo('.errorMassage');
    $(span).slideDown(500);
    setTimeout(function(){
        $(span).slideUp(500, function(){span.remove()});
    }, 5000);
}
function memoryIndex(index1, index2=0){
    return (index1 + index2 + parseInt(disp.value, 16) ) % memoryLimit;
}
//objects
class Registry {
    constructor(name){
        this._value= defaultRegisterValue;
        this.regex = heksaDecimalNumbers;
        this.name = name;

    }
    get value(){
        return this._value;
    }
    set value(x){
        if(x.length>4)
        {
            errorMessageAlert(registerErrorMessage(this.name.toUpperCase()));
            return false;
        }
         x='0'.repeat(4-x.length)+x;
        if(!this.regex.test(x))
        {
            errorMessageAlert(registerErrorMessage(this.name.toUpperCase()));
            return false;
        }
        
        this._value=x.toUpperCase();
        this.refresh();
        errorMessageAlert(registerCompleteMessage(this.name.toUpperCase()));
        return true;
    }
    random(){
        const chars = [0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F']; 
        let output = "";
        for(let i =0; i<4;i++)
        {
            output += chars[Math.floor(Math.random()*16)];
        }
        this._value = output;
        errorMessageAlert(randomizedMessage(this.name.toUpperCase()));
        this.refresh();
        return true;
    }
    clear(){
        this._value = defaultRegisterValue;
        let string = '.' + this.name + ' >' + registerDisplayClass;
        $(string).html(this.value);
        errorMessageAlert(clearMessage(this.name.toUpperCase()));
        return true;
    }
    refresh(){
        let string = '.' + this.name + ' >' + registerDisplayClass;
        $(string).html(this.value);
        return true;
    }
}
class Stack{
    constructor(){
        this.stack = new Array(0);
    }
    push(x){
        if(this.stack.length == memoryLimit)
            {
                errorMessageAlert(stackLimitMessage);
                return;
            }
        this.stack.push(x[0]+x[1]);
        this.stack.push(x[2]+x[3]);
        this.refresh();
        return true;
    };
    pop(x){
        if(this.stack.length == 0 )
            {
                $('.stackDisplay').html(emptyStackMessage);
                errorMessageAlert(stackEmptyMessage);
                return;
            }
        let mes1 = this.stack.pop();
        let mes2 = this.stack.pop();
        eval(x).value= mes2+mes1;
        this.refresh();
        return true;
    };
    top(){
        return this.stack[this.stack.length-2] + this.stack[this.stack.length-1];
    }
    refresh(){
        let val;
        if(stack.top()==undefined)
        {
            val=emptyStackMessage;
        } else {
            val = this.top();
        }
        $(stackDisplayClass).html(val);
        let len16 = this.stack.length.toString(16).toUpperCase();
        sp.value = len16;
        if(this.stack.length == 0 )
            {
                $('.stackDisplay').html(emptyStackMessage);
                return;
            }
        return true;
    }
    clear(){
        this.stack = new Array(0);
        this.refresh();
    }

    
}
//main
let ax = new Registry('ax');
let bx = new Registry('bx');
let cx = new Registry('cx');
let dx = new Registry('dx');
let si = new Registry('si');
let di = new Registry('di');
let bp = new Registry('bp');
let sp = new Registry('sp');
let disp = new Registry('disp');
let stack = new Stack();
let memory = new Array(memoryLimit);

$(document).ready(function () {
    window.addEventListener('contextmenu', (e)=>{e.preventDefault()},false);
    $(registerDisplayClass + ", " + registerNameClass).mousedown(function (e) { 
        if($(this).parent().parent().hasClass('registersRight'))
            return;
            
        let name = $(this).parent().children(0).html().toLowerCase();
        switch(e.which)
            {
                case 1:
                    $('.blue').removeClass('blue');
                    if($(this).parent().hasClass('red'))
                    {
                        $(this).parent().removeClass('red');
                        $('.m2Display').html(emptyRegisterMessage);
                    }
                    $(this).parent().addClass('blue');
                    $('.m1Display').html("("+name.toUpperCase()+") "+ eval(name).value);
                    $('.whichRegister-2').html("("+name.toUpperCase()+") "+ eval(name).value);
                    break;
                case 3:
                    $('.red').removeClass('red');
                    if($(this).parent().hasClass('blue'))
                    {
                        $(this).parent().removeClass('blue');
                        $('.m1Display').html(emptyRegisterMessage);
                        $('.whichRegister-2').html(emptyHexNumber);
                    }
                    $(this).parent().addClass('red');
                    $('.m2Display').html("("+name.toUpperCase()+") "+ eval(name).value);
                    break;
            }
    });
    function unmark(){
        $('.blue').removeClass('blue');
        $('.red').removeClass('red');
        $('.m1Display').html(emptyRegisterMessage);
        $('.m2Display').html(emptyRegisterMessage);
        $('.whichRegister-2').html(emptyHexNumber);
    }
    $('.register > button').on('click', function (e) {
        let name = $(this).parent().children(0).html();
        $('.editTitle > span').html(name);
        $('.editInput').val(eval(name.toLowerCase()).value);
        $('.edit').css('display', 'flex');
    });
    $('.editClose').on('click', function () {
        $('.edit').css('display', 'none');
    });
    $('.editButton').on('click', function () {
        let name = $('.editTitle > span').html().toLowerCase();
        let val = $('.editInput').val();
        if(val.length>4)
        {
            errorMessageAlert(registerErrorMessage(name.toUpperCase()));
            return
        }
        val = '0'.repeat(4-val.length)+val;
        let reg = /[0-9A-Fa-f]{4}/g;
        if(!reg.test(val))
        {
            errorMessageAlert(registerErrorMessage(name.toUpperCase()));
            return;
        }
        unmark();
        eval(name).value = val;
        $('.edit').css('display', 'none');
    });




    $('.unmark').on('click', unmark);
    $('.move').on('click', function () {
        let from = $('.blue'), to = $('.red');
        if(from.length == 1 && to.length == 1)
        {
            let name1 = $(from).children().html().toLowerCase();
            let name2 = $(to).children().html().toLowerCase();
            eval(name2).value = eval(name1).value;
            unmark();
        } else {
            errorMessageAlert(selectBothMessage);
        }

    });
    $('.exch').on('click', function () {
        let from = $('.blue'), to = $('.red');
        if(from.length == 1 && to.length == 1)
        {
        let name1 = $(from).children().html().toLowerCase();
        let name2 = $(to).children().html().toLowerCase();
        let help = eval(name1).value;
        eval(name1).value = eval(name2).value;
        eval(name2).value = help;
        unmark();
        } else {
            errorMessageAlert(selectBothMessage);
        }
    });
    $('.clear').on('click', function () {
        let from = $('.blue'), to = $('.red');
        if(from.length == 1)
        {
            let name1 = $(from).children().html().toLowerCase();
            eval(name1).clear();
        }
        if(to.length == 1)
        {
            let name2 = $(to).children().html().toLowerCase();
            eval(name2).clear();
        }
        if(from.length != 1 && to.length != 1)
        {
            errorMessageAlert(selectBothMessage);
        }
        unmark();
    });
    $('.random').on('click', function () {
        let from = $('.blue'), to = $('.red');
        if(from.length == 1)
        {
            let name1 = $(from).children().html().toLowerCase();
            eval(name1).random();
        }
        if(to.length == 1)
        {
            let name2 = $(to).children().html().toLowerCase();
            eval(name2).random();
        }
        if(from.length != 1 && to.length !=1)
        {
            errorMessageAlert(selectAnyMessage);
        }
        unmark();
    });
    $('.push').on('click', function () {
        let from = $('.blue');
        if(from.length == 1)
        {
            let name1 = $(from).children().html().toLowerCase();
            stack.push(eval(name1).value);
        } else {
            errorMessageAlert(selectSingleMessage);
        }
    });
    $('.pop').on('click', function () {
        let from = $('.blue');
        if(from.length == 1)
        {
            let name1 = $(from).children().html().toLowerCase();
            stack.pop(name1);
        } else {
            errorMessageAlert(selectSingleMessage);
        }
    });
    $('.clearStack').on('click', function () {
            stack.clear();
            errorMessageAlert(clearMessage('stack'));
    });

    ///memory

    $('.rightOptionsInput').on('click', function () {
        $('.rightOptionsInput').prop('checked', false);
        $(this).prop('checked', true);
    });
    $('.registerChoose').on('click', function () {
        let classList = $(this).attr('class').slice(15);
        let output = [];
        if(classList.length > 2)
        {
            output[0] = parseInt(eval(classList.substr(0,2)).value,16);
            output[1] = parseInt(eval(classList.substr(2,2)).value,16);

        } else {
            output = [parseInt(eval(classList).value,16),0];
        }
        let index = memoryIndex(output[0], output[1]);
        let mess1, mess2;
        if(index == memoryLimit -1)
            {
                 if(memory[index] == undefined){
                     mess1 = "--";
                 }   else {
                     mess1 = memory[index];
                 }
                 if(memory[0] == undefined){
                     mess2 = "--";
                 }   else {
                     mess2 = memory[0];

                 }
            } else {
                if(memory[index] == undefined){
                    mess1 = "--";
                }   else {
                    mess1 = memory[index];
                }
                if(memory[index+1] == undefined){
                    mess2 = "--";
                }   else {
                    mess2 = memory[index+1];

                }
            }
        index= index.toString(16).toUpperCase();
        index = '0'.repeat(4-index.length)+index;
        $('.memoryIndex').html(index);
        $('.memoryValue').html(mess1 + mess2);  
        
    });
    function memoryButtonsCheck(){
        let val = $('.rightOptionsInput:checked').val();
        if(val == undefined)
        {
            errorMessageAlert(inputsSelectMessage);
            return false;
        }
        let name = $('.blue').children().html();
        if(name == undefined)
        {
            errorMessageAlert(selectSingleMessage);
            return false;
        }
        let index = $('.memoryIndex').html();   
        if(index == emptyHexNumber)
        {
            errorMessageAlert(indexMessage);
            return false;
        }
        return [val, name.toLowerCase(), parseInt(index,16)];
    };
    
    $('.memoryMove').on('click', function () {
        let ret = memoryButtonsCheck();
        if(ret == false)
            return;
        let val = ret[0], name = ret[1],index = ret[2];
        switch(val)
        {
            case '1':
                if(index == memoryLimit -1)
                {
                    memory[index] = eval(name).value.substr(0,2);
                    memory[0] = eval(name).value.substr(2,2);
                } else {
                    memory[index] = eval(name).value.substr(0,2);
                    memory[index+1] = eval(name).value.substr(2,2);
                }
                $('.memoryValue').html(eval(name).value);
                break;
            case '2':
                if(memory[index] == undefined)
                {
                    errorMessageAlert(moveUndefindedMessage);
                    return;
                }
                
                if(index == memoryLimit -1)
                {
                    if(memory[index] == undefined || memory[0] == undefined)
                    {
                        errorMessageAlert(emptyMemoryMessage);
                        return;
                    } else {
                        eval(name).value = memory[index] + memory[0];
                        $('.whichRegister-2').html('('+name.toUpperCase()+') ' + eval(name).value);
                    }
                    
                } else {
                    if(memory[index] == undefined || memory[index+1] == undefined)
                    {
                        errorMessageAlert(emptyMemoryMessage);
                        return;
                    } else {
                        eval(name).value = memory[index] + memory[index+1];
                        $('.whichRegister-2').html('('+name.toUpperCase()+') ' + eval(name).value);
                    }
                }
                
                break;
            default:
                errorMessageAlert(defaultMessage);
                return
        }
        
        
    });
    $('.memoryExch').on('click', function () {
        let ret = memoryButtonsCheck();
        if(ret == false)
            return;
        let val = name = ret[1], index = ret[2];  
        let mem1, mem2;
        if(index == memoryLimit -1)
        {
            if(memory[index]== undefined || memory[0] == undefined)
            {
                errorMessageAlert(emptyMemoryMessage);
                return;
            } else {
                help = memory[index] + memory[0];
                memory[index] = eval(name).value.substr(0,2);
                memory[0] = eval(name).value.substr(2,2);
                eval(name).value = help;
                $('.memoryValue').html(memory[index] + memory[0]);
            }
            
        } else {
            if(memory[index]== undefined || memory[index+1] == undefined)
            {
                errorMessageAlert(emptyMemoryMessage);
                return;
            } else {
                help = memory[index] + memory[index +1];
                memory[index] = eval(name).value.substr(0,2);
                memory[index +1] = eval(name).value.substr(2,2);
                eval(name).value = help;
                $('.memoryValue').html(memory[index] + memory[index +1]);
            }
        }  
    });
    $('.clearMemory').on('click', function () {
        memory = new Array(memoryLimit);
        $(".whichRegister-2").html(emptyHexNumber);
        $('.memoryValue').html(emptyHexNumber);
    });
    $('.adressClear').on('click', function () {
        si.clear();
        di.clear();
        bp.clear();
        disp.clear();
    });
    $('.adressRandom').on('click', function () {
        si.random();
        di.random();
        bp.random();
        disp.random();
    });

    $(registerDisplayClass).html(defaultRegisterValue);
    $('.m1Display, .m2Display').html(emptyRegisterMessage);
    $('.stackDisplay').html(emptyStackMessage);
    $('.memoryIndex, .memoryValue').html(emptyHexNumber);
    $('.whichRegister-2').html(emptyHexNumber);
});
