import styles from '../styles/App.module.css'

import NavBar from "./components/NavBar";

export default function Home() {

    return (
        <div>
            <NavBar page="rules"/>
            <h1 className={styles.h1}>SOCK WARS</h1>

            <h2 className={styles.h2}>RULES</h2>

            <div className={styles.rulesContainer}>
                <div className={styles.p}>
                    1. Each player has a secret “target” which they must eliminate through tagging them with a sock.<br />
                    <br />
                    2. Players cannot tag another player who is following the “immunity” for that day (can be checked through the “Immunity” tab).<br />
                    <br />
                    3. If a player eliminated their target, they inherit the eliminated player’s target.<br />
                    <br />
                    4. When a player is eliminated, both the eliminated player and the eliminator need to confirm the elimination on this website.
                </div>
            </div>

            <div className={styles.startContainer}>
                <p className={styles.a}>
                    START
                </p>
            </div>

        </div>
    )
}