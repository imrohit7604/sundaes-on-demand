import SummaryForm from '../SummaryForm';
import userEvent from "@testing-library/user-event"
const { render, screen, waitForElementToBeRemoved } = require("@testing-library/react")

test("inital condition", () => {
    render(<SummaryForm />)
    const checkbox = screen.getByRole("checkbox", { name: /terms and condition/i })
    const confirmButton = screen.getByRole("button", { name: /confirm order/i })
    expect(confirmButton).toBeDisabled()
    expect(checkbox).not.toBeChecked()

})

test("checkbox enables button on first click and disable on select click", () => {
    render(<SummaryForm />)
    const checkbox = screen.getByRole("checkbox", { name: /terms and condition/i })
    const confirmButton = screen.getByRole("button", { name: /confirm order/i })

    userEvent.click(checkbox)
    expect(checkbox).toBeChecked()
    expect(confirmButton).toBeEnabled()

    userEvent.click(checkbox)
    expect(checkbox).not.toBeChecked()
    expect(confirmButton).toBeDisabled()
})


test("popover responds to hover", async () => {
    render(<SummaryForm />)
    //popover starts at hidden
    const nullPopOver = screen.queryByText(/No ice cream will actually be delivered/i)
    expect(nullPopOver).not.toBeInTheDocument()


    //popover appears upon mouseover of checkbox label
    const termsAndCondition = screen.getByText(/terms and conditions/i)
    userEvent.hover(termsAndCondition)


    const popOver = screen.getByText(/No ice cream will actually be delivered/i)
    expect(popOver).toBeInTheDocument()

    //popover disappears when we mouse out
    userEvent.unhover(termsAndCondition)

    await waitForElementToBeRemoved(() => screen.queryByText(/No ice cream will actually be delivered/i))




})