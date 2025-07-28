import { Address } from "./address.interface";
import { ItemToOrder } from "./item.interface";
import { OrderToCreate } from "./order.interface"

export interface CheckoutData {
    order: OrderToCreate;
    address: Address;
    items: ItemToOrder[];
    cardInfos: {
        cardexpirationdate: string,
        cvv: string,
        cardowner: string,
        cardnumber: string
    },
    additionalInfos: {
        meansofcommunication: string,
        phonenumber: string
    }
}