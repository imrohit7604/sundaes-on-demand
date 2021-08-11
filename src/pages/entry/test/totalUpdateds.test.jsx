import { render, screen, waitFor } from '../../../test-utils/testing-library-utils';
import userEvent from '@testing-library/user-event';
import Options from '../Options';
import OrderEntry from '../OrderEntry';

test('update scoop subtotal when scoops change', async () => {
    render(<Options optionType="scoops" />);

    // make sure total starts out $0.00
    const scoopsSubtotal = screen.getByText('Scoops total: $', { exact: false });
    expect(scoopsSubtotal).toHaveTextContent('0.00');

    // update vanilla scoops to 1 and check the subtotal
    const vanillaInput = await screen.findByRole('spinbutton', {
        name: 'Vanilla',
    });
    userEvent.clear(vanillaInput);
    userEvent.type(vanillaInput, '1');
    expect(scoopsSubtotal).toHaveTextContent('2.00');

    // update chocolate scoops to 2 and check subtotal
    const chocolateInput = await screen.findByRole('spinbutton', {
        name: 'Chocolate',
    });
    userEvent.clear(chocolateInput);
    userEvent.type(chocolateInput, '2');
    expect(scoopsSubtotal).toHaveTextContent('6.00');
});

test("initial Condtion for toppings", async () => {
    render(<Options optionType="toppings" />)
    const toppingSubTotal = screen.getByText("Toppings total: $", { exact: false })
    expect(toppingSubTotal).toHaveTextContent("0.00")

    await waitFor(async () => {
        const toppingsCheckboxes = await screen.findAllByRole("checkbox")
        expect(toppingsCheckboxes).toHaveLength(3)
    })
})

test("update topping subtotal when topping is checked", async () => {
    render(<Options optionType="toppings" />)
    const toppingSubTotal = screen.getByText("Toppings total: $", { exact: false })
    expect(toppingSubTotal).toHaveTextContent("0.00")

    const cherriesCheckBox = await screen.findByRole("checkbox", { name: /Cherries/i })
    expect(cherriesCheckBox).not.toBeChecked()

    userEvent.click(cherriesCheckBox)
    expect(toppingSubTotal).toHaveTextContent("1.50")

    const mmsCheckbox = await screen.findByRole("checkbox", { name: /M&Ms/i })
    expect(mmsCheckbox).not.toBeChecked()

    userEvent.click(mmsCheckbox)
    expect(toppingSubTotal).toHaveTextContent("3.00")

    userEvent.click(mmsCheckbox)
    expect(toppingSubTotal).toHaveTextContent("1.50")

})


describe("grand total", () => {


    test("grand total updates properly if scoop is added first", async () => {
        render(<OrderEntry />)
        const grandTotal = screen.getByText("Grand total: $", { exact: false })
        const subTotal = screen.getByText("Scoops total: $", { exact: false })
        const chocolateInput = await screen.findByRole("spinbutton", { name: "Chocolate" })

        expect(grandTotal).toHaveTextContent("0.00")
        userEvent.type(chocolateInput, "1")

        expect(subTotal).toHaveTextContent("2.00")
        expect(grandTotal).toHaveTextContent("2.00")
    })

    test("grand total updates properly if topping is added first", async () => {
        render(<OrderEntry />)
        const grandTotal = screen.getByText("Grand total: $", { exact: false })
        const subTotal = screen.getByText("Toppings total: $", { exact: false })
        const cherriesCheckBox = await screen.findByRole("checkbox", { name: /Cherries/i })

        userEvent.click(cherriesCheckBox)

        expect(subTotal).toHaveTextContent("1.50")
        expect(grandTotal).toHaveTextContent("1.50")
    })

    test("grand total updates properly if item is removed", async () => {
        render(<OrderEntry />)
        const grandTotal = screen.getByText("Grand total: $", { exact: false })
        const subTotal = screen.getByText("Toppings total: $", { exact: false })
        const cherriesCheckBox = await screen.findByRole("checkbox", { name: /Cherries/i })
        const hotFudgeCheckBox = await screen.findByRole("checkbox", { name: /Hot fudge/i })

        userEvent.click(cherriesCheckBox)
        userEvent.click(hotFudgeCheckBox)

        expect(subTotal).toHaveTextContent("3.00")
        expect(grandTotal).toHaveTextContent("3.00")

        userEvent.click(hotFudgeCheckBox)

        expect(subTotal).toHaveTextContent("1.50")
        expect(grandTotal).toHaveTextContent("1.50")
    })

})