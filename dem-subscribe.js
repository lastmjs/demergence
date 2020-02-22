class DEMSubscribe extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = `
            <div>
                Subscribe for updates:

                <form method='post' action='https://blogtrottr.com'>
                    <input type='text' name='btr_email' placeholder="Email address" />
                    <br />
                    <br />
                    <input type='hidden' name='btr_url' value='https://demergence.org/feed.xml' />
                    <input type='hidden' name='schedule_type' value='0' />
                    <input style="cursor: pointer" type='submit' value='Subscribe' />
                    <br />
                    <br />
                    <div>
                        <a target="_blank" href="https://blogtrottr.com/legal">Terms and Privacy</a>
                    </div>
                </form>
            </div>        
        `;
    }
}

window.customElements.define('dem-subscribe', DEMSubscribe);