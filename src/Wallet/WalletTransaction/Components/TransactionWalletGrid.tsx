import { ITransactionWallet } from "../Entites";
import TransactionWalletPaper from "./TransactionWalletPaper/index";

type props = {
  allTransactionWallet: ITransactionWallet[] | [];
};

function TransactionWalletGrid({ allTransactionWallet }: props) {
  
  return (
    // TODO: Edit grid css className.
    <div className="reqs-filterless-grid-container">
      {allTransactionWallet != null &&
        allTransactionWallet.map((c) => (
          <TransactionWalletPaper allTransactionWallet={c} />
        ))}
    </div>
  );
}
export default TransactionWalletGrid;
