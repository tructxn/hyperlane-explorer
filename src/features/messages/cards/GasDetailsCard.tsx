import BigNumber from 'bignumber.js';
import { utils } from 'ethers';
import Image from 'next/image';

import { HelpIcon } from '../../../components/icons/HelpIcon';
import { Card } from '../../../components/layout/Card';
import { links } from '../../../consts/links';
import FuelPump from '../../../images/icons/fuel-pump.svg';
import { Message } from '../../../types';
import { fromWeiRounded } from '../../../utils/amount';
import { logger } from '../../../utils/logger';

import { KeyValueRow } from './KeyValueRow';

interface Props {
  message: Message;
  shouldBlur: boolean;
}

export function GasDetailsCard({ message, shouldBlur }: Props) {
  const { totalGasAmount, totalPayment: totalPaymentWei } = message;
  const totalPaymentGwei = fromWeiRounded(totalPaymentWei, 'gwei', true, 0);
  const avgPrice = computeAvgGasPrice(totalGasAmount, totalPaymentWei);

  return (
    <Card classes="w-full space-y-4">
      <div className="flex items-center justify-between">
        <Image src={FuelPump} width={24} height={24} alt="" />
        <div className="flex items-center pb-1">
          <h3 className="text-gray-500 font-medium text-md mr-2">Interchain Gas Payments</h3>
          <HelpIcon
            size={16}
            text="Amounts paid to the Interchain Gas Paymaster for message delivery."
          />
        </div>
      </div>
      <p className="text-sm">
        Interchain gas payments are required to fund message delivery on the destination chain.{' '}
        <a
          href={`${links.docs}/docs/build-with-hyperlane/guides/paying-for-interchain-gas`}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer text-blue-500 hover:text-blue-400 active:text-blue-300 transition-all"
        >
          Learn more about gas on Hyperlane.
        </a>
      </p>
      <KeyValueRow
        label="Total gas amount:"
        labelWidth="w-32"
        display={totalGasAmount?.toString() || '0'}
        blurValue={shouldBlur}
      />
      <KeyValueRow
        label="Total gas payments:"
        labelWidth="w-32"
        display={totalPaymentWei ? `${totalPaymentWei} (${totalPaymentGwei} gwei)` : '0'}
        blurValue={shouldBlur}
      />
      <KeyValueRow
        label="Average gas price:"
        labelWidth="w-32"
        display={avgPrice ? `${avgPrice.wei} (${avgPrice.gwei} gwei)` : '-'}
        blurValue={shouldBlur}
      />
    </Card>
  );
}

function computeAvgGasPrice(gasAmount?: number, payment?: number) {
  try {
    if (!gasAmount || !payment) return null;
    const paymentBN = new BigNumber(payment);
    const wei = paymentBN.div(gasAmount).toFixed(0);
    const gwei = utils.formatUnits(wei, 'gwei').toString();
    return { wei, gwei };
  } catch (error) {
    logger.debug('Error computing avg gas price', error);
    return null;
  }
}
