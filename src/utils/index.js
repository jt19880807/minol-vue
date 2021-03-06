
export const selectCityValue=(cityText,cityData)=>{
    var citys=cityText.split("/");
    var result=[];
    for (var i=0;i<cityData.length;i++){
        if (cityData[i].label===citys[0]){
            result.push(cityData[i].value);
            for (var j=0;j<cityData[i].children.length;j++){
                if (cityData[i].children[j].label===citys[1]){
                    //this.cityvalue[1]=this.cityData[i][j].value;
                    result.push(cityData[i].children[j].value);
                }
            }
        }
    }
    return result;
};
export  const checkeAllPermissions=(permissions)=>{
  for (var p in permissions){
      permissions[p].checked=true;
      permissions[p].expand=true;
      // if (permissions[p].children.length>0){
           checkeAllPermissions(permissions[p].children);
      // }
  }
};
export  const checkePartPermissions=(permissions,rights)=>{

    //var allRights=rights.split(",");
    //console.log(allRights);
    for (var p in permissions){
        permissions[p].expand=true;

        if(rights.includes(permissions[p].id)){
            permissions[p].checked=true;
        }
        else {
            permissions[p].checked=false;
        }

        // if (permissions[p].children.length>0){
        checkePartPermissions(permissions[p].children,rights);
        // }
    }
};
export  const uploadImportTemplates=(name)=>{
    window.open("http://localhost:8082/import/"+name);
};
