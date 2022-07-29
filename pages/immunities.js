import styles from '../styles/App.module.css'
import NavBar from "./components/NavBar";

export default function Home() {

    return (
        <div>
            <NavBar page="immunities" />
            
            <h1 className={styles.h1}>SOCK WARS</h1>

            <h2 className={styles.h2}>Today's Immunity: <br /> Wear 2 Different Color Socks!</h2>
            <table className={styles.table2}>
                <tr className={styles.trh2}>
                    <th className={styles.th}>Date</th>
                    <th className={styles.th}>Past Immunity</th>
                </tr>
                <tr className={styles.tr2}>
                    <td className={styles.td}>03/19/2022</td>
                    <td className={styles.td}>Wear a green shirt!</td>
                </tr>
                <tr className={styles.tr2}>
                    <td className={styles.td}>02/14/2022</td>
                    <td className={styles.td}>Wear a bagel around your neck on a string!</td>
                </tr>
                <tr className={styles.tr2}>
                    <td className={styles.td}>02/09/2022</td>
                    <td className={styles.td}>Wear a pink shirt!</td>
                </tr>
                <tr className={styles.tr2}>
                    <td className={styles.td}>02/01/2022</td>
                    <td className={styles.td}>Wear a yellow shirt!</td>
                </tr>
                <tr className={styles.tr2}>
                    <td className={styles.td}>01/19/2022</td>
                    <td className={styles.td}>Wear a blue shirt!</td>
                </tr>
                <tr className={styles.tr2}>
                    <td className={styles.td}>01/08/2022</td>
                    <td className={styles.td}>Wear a red shirt!</td>
                </tr>
            </table>
        </div>
    )
}