const deleteProduct = (btn) =>{
    const currentDiv = btn.parentNode;
    const csrf = currentDiv.querySelector('[name=_csrf]').value;
    const productId = currentDiv.querySelector('[name=productId]').value;
    const productElement = btn.closest('article');
    fetch('/admin/product/' + productId,{
        method:"DELETE",
        headers:{
            'csrf-token':csrf
        }
    }).then(result => {
        return result.json()
        
    }).then(result=>{
        console.log(result)

        productElement.parentNode.removeChild(productElement)
    }).catch(err=>{
        console.log(err)
    })
    
 
    
}