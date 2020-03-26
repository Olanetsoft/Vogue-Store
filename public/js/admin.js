const deleteProduct = (btn) => {

    const prodId = btn.parentNode.querySelector('[name=productId]').value;
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

    //getting the card on the DOM
    const productElement = btn.closest('article');

    fetch('/admin/product/' + prodId, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrf
        }
    })
    .then(result => {
        return result.json();
    })
    .then(data => {
       productElement.parentNode.removeChild(productElement);
    })
    .catch(err => {
        console.log(err);
    })
};