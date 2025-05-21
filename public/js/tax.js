let taxSwitch = document.getElementById('flexSwitchCheckDefault');
taxSwitch.addEventListener('click',()=>{
    let taxInfo = document.getElementsByClassName('tax-info');
    for(let it of taxInfo){
        if(it.style.display != 'inline'){
            it.style.display = 'inline';
        }else{
            it.style.display = 'none';
        }
    }
})