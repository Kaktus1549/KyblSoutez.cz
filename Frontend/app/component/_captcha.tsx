import Image from "next/image";

export default function ReCaptcha({maxShowed, showMax}: {maxShowed: boolean, showMax: () => void}) {

    const maxStatus = maxShowed;

    function Verify({maxShowed, showMax} : {maxShowed: boolean, showMax: () => void}) {
        if (maxShowed != false){
            return
        }
        const checkbox = document.querySelector<HTMLElement>('.recaptcha-checkbox');
        const loadImg = document.querySelector<HTMLElement>('.loadImg');
        if (!checkbox || !loadImg) return;
        checkbox.style.display = 'none';
        loadImg.style.display = 'block';

        showMax();
    }

    return (
        <div className="recaptcha-body">
            <div className="modalContainer">
                <h2>Robot or human?</h2>
                <p>Check the box to confirm that you're human. Thank You!</p>
                <div id="captcha-container" className="captcha-container">
                    <div className="recaptcha-mock">
                        <div
                            className="recaptcha-checkbox"
                            onClick={() => Verify({ maxShowed, showMax })}
                        ></div>
                            <div className="loadImg"></div>
                            <span className="recaptcha-label">I'm not a robot</span>
                            <Image
                                src="/Images/logo_48.png"
                                alt="reCAPTCHA logo"
                                width={32}
                                height={32}
                                style={{ position: 'absolute', marginRight: -200, marginTop: -15 }}
                            />
                            <div className="recaptcha-logo">reCAPTCHA</div>
                    </div>
                </div>
            </div>
        </div>
    );
}